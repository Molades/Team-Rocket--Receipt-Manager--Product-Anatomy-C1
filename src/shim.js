// Native bridge for Receipt Keeper: stands in for the web page's window.claude
// capabilities (sample = bill reading, downloads = saving files) and adds
// camera, file storage, share sheet and the Android back button.
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { registerPlugin } from '@capacitor/core';

const CATS = ['Groceries','Shopping','Utilities','Travel','Dining','Services','Rent','Health','Other'];
const ROOT = 'ReceiptKeeper';

window.RK_NATIVE = true;
document.documentElement.classList.add('native');
window.RK_LIBS = { jspdf: 'libs/jspdf.umd.min.js', pdf: 'libs/pdf.min.js', pdfWorker: 'libs/pdf.worker.min.js' };

/* ---------- API key ---------- */
let key = null;
const keyReady = Preferences.get({ key: 'anthropic_key' }).then(r => { key = r.value || null; }).catch(() => {});
window.RK_key = {
  get: () => key,
  set: async v => { key = v || null; model = null;
    if (v) await Preferences.set({ key: 'anthropic_key', value: v }); else await Preferences.remove({ key: 'anthropic_key' }); },
  ready: keyReady
};

/* ---------- OCR.space (free OCR engine) ---------- */
import { OCR_SPACE_KEY } from './keys.js';
const DEFAULT_OCR_KEY = OCR_SPACE_KEY || 'helloworld'; // 'helloworld' is OCR.space's public demo key
let ocrKey = DEFAULT_OCR_KEY;
const ocrReady = Preferences.get({ key: 'ocrspace_key' }).then(r => { if (r.value) ocrKey = r.value; }).catch(() => {});
window.RK_ocrKey = {
  get: () => ocrKey, isDefault: () => ocrKey === DEFAULT_OCR_KEY,
  set: async v => { ocrKey = v || DEFAULT_OCR_KEY; if (v) await Preferences.set({ key: 'ocrspace_key', value: v }); else await Preferences.remove({ key: 'ocrspace_key' }); }
};
// Free plan limit is 1 MB per file: shrink the scan until it fits.
async function under1MB(blob) {
  if (blob.size < 950000) return blob;
  const bmp = await createImageBitmap(blob);
  let scale = Math.sqrt(900000 / blob.size), q = 0.8, out = blob;
  for (let i = 0; i < 4 && out.size >= 950000; i++, scale *= 0.85) {
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    out = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
  }
  return out;
}
window.RK_ocr = async (blob, opts = {}) => {
  await ocrReady;
  const fd = new FormData();
  fd.append('file', await under1MB(blob), 'bill.jpg');
  fd.append('OCREngine', '2');          // engine 2: best on receipts, numbers and special characters
  fd.append('isTable', 'true');         // keep receipt lines in order, item and price on one line
  fd.append('scale', 'true');
  fd.append('detectOrientation', 'true');
  let r;
  try { r = await fetch('https://api.ocr.space/parse/image', { method: 'POST', headers: { apikey: ocrKey }, body: fd, signal: opts.signal }); }
  catch (e) { if (e && e.name === 'AbortError') throw E('cancelled'); throw E('upstream_error', 'Network error'); }
  if (r.status === 403 || r.status === 401) throw E('bad_ocr_key');
  if (r.status === 429) throw E('rate_limited');
  if (!r.ok) throw E('upstream_error', 'HTTP ' + r.status);
  const j = await r.json();
  if (j.IsErroredOnProcessing) { const m = [].concat(j.ErrorMessage || []).join(' ');
    throw E(/api ?key/i.test(m) ? 'bad_ocr_key' : /limit|maximum|exceed/i.test(m) ? 'rate_limited' : 'image_rejected', m); }
  const text = (j.ParsedResults || []).map(p => p.ParsedText || '').join('\n');
  if (!text.trim()) throw E('empty_completion');
  return text;
};

/* ---------- bill reading via the Anthropic API ---------- */
const FALLBACK_MODEL = 'claude-sonnet-4-5';
let model = null;
const headers = () => ({ 'x-api-key': key, 'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true', 'content-type': 'application/json' });
const E = (code, message, text) => ({ code, message: message || code, text });
function b64(blob) { return new Promise((res, rej) => { const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); }); }
async function pickModel() {
  if (model) return model;
  try {
    const r = await fetch('https://api.anthropic.com/v1/models?limit=100', { headers: headers() });
    if (r.ok) { const ids = ((await r.json()).data || []).map(m => m.id);
      model = ids.find(i => /sonnet/i.test(i)) || ids.find(i => /opus/i.test(i)) || ids[0]; }
  } catch (e) {}
  return model || (model = FALLBACK_MODEL);
}
async function ask(input, opts = {}, retried) {
  await keyReady;
  if (!key) throw E('no_key');
  const content = [];
  const imgs = !opts.images ? [] : (opts.images instanceof Blob ? [opts.images] : Array.from(opts.images));
  for (const im of imgs) content.push({ type: 'image', source: { type: 'base64', media_type: im.type || 'image/jpeg', data: await b64(im) } });
  content.push({ type: 'text', text: typeof input === 'string' ? input : input.map(m => m.content).join('\n\n') });
  const m = await pickModel();
  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: headers(), signal: opts.signal,
      body: JSON.stringify({ model: m, max_tokens: 2500, messages: [{ role: 'user', content }] }) });
  } catch (e) {
    if (e && e.name === 'AbortError') throw E('cancelled');
    throw E('upstream_error', 'Network error: ' + e);
  }
  if (r.status === 401 || r.status === 403) throw E('bad_key');
  if (r.status === 429 || r.status === 529) throw E('rate_limited');
  if (!r.ok) {
    const t = await r.text();
    if (!retried && /model/i.test(t) && m !== FALLBACK_MODEL) { model = FALLBACK_MODEL; return ask(input, opts, true); }
    throw E(r.status === 400 && /image/i.test(t) ? 'image_rejected' : 'upstream_error', t);
  }
  const j = await r.json();
  const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  if (!text.trim()) throw E('empty_completion');
  if (opts.onText) try { opts.onText({ text, delta: text }); } catch (e) {}
  return { text, truncated: j.stop_reason === 'max_tokens', modelTierApplied: 'default' };
}
function parseJson(t) {
  try { return JSON.parse(t); } catch (e) {}
  const f = t.match(/```(?:json)?\s*([\s\S]*?)```/); if (f) { try { return JSON.parse(f[1]); } catch (e) {} }
  const a = t.search(/[{[]/), b = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  throw E('invalid_json', 'No JSON in reply', t);
}
const sample = (input, opts) => ask(input, opts);
sample.json = async (input, opts) => { const r = await ask(input, opts); if (r.truncated) throw E('invalid_json', 'truncated', r.text); return parseJson(r.text); };
sample.limits = async () => ({ maxPromptBytes: 65536, images: { maxCount: 4, maxInputBytes: 20e6, mediaTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] } });

/* ---------- files ---------- */
async function toData(data) {
  if (typeof data === 'string') return { data, encoding: Encoding.UTF8 };
  const blob = data instanceof Blob ? data : new Blob([data]);
  return { data: await b64(blob) };
}
function folderFor(filename) {
  if (/^Receipt Keeper - /.test(filename)) return 'Exports';
  if (/backup/i.test(filename)) return 'Backups';
  const first = filename.split(' - ')[0];
  return CATS.includes(first) ? first : 'Bills';
}
async function writeDoc(path, data) {
  const d = await toData(data);
  await Filesystem.writeFile({ path, directory: Directory.Documents, recursive: true, ...d });
  return 'Documents/' + path;
}
async function shareFile(filename, data, title, text) {
  const d = await toData(data);
  const w = await Filesystem.writeFile({ path: 'share/' + filename, directory: Directory.Cache, recursive: true, ...d });
  await Share.share({ title: title || filename, text: text || undefined, files: [w.uri], dialogTitle: 'Share bill' });
}
const downloads = {
  async save({ filename, data }) {
    const path = ROOT + '/' + folderFor(filename) + '/' + filename;
    try { return { status: 'saved', path: await writeDoc(path, data) }; }
    catch (e) {
      // Some phones block the public Documents folder: hand the file to the share sheet instead.
      try { await shareFile(filename, data); return { status: 'delivered' }; }
      catch (e2) { throw { code: /cancel/i.test(String(e2)) ? 'declined' : 'unavailable', message: String(e2) }; }
    }
  }
};
// Every bill's PDF is also kept in Documents/ReceiptKeeper/<Category>/
window.RK_store = async (category, filename, blob, oldPath) => {
  const rel = ROOT + '/' + (CATS.includes(category) ? category : 'Other') + '/' + filename;
  if (oldPath && oldPath !== 'Documents/' + rel) { try { await Filesystem.deleteFile({ path: oldPath.replace(/^Documents\//, ''), directory: Directory.Documents }); } catch (e) {} }
  return writeDoc(rel, blob);
};
window.RK_unstore = path => Filesystem.deleteFile({ path: path.replace(/^Documents\//, ''), directory: Directory.Documents }).catch(() => {});
window.RK_share = (filename, blob, title, text) => shareFile(filename, blob, title, text).catch(e => { if (!/cancel/i.test(String(e))) throw e; });

/* ---------- camera ---------- */
window.RK_camera = async () => {
  try {
    const p = await Camera.getPhoto({ source: CameraSource.Camera, resultType: CameraResultType.Uri, quality: 92,
      correctOrientation: true, saveToGallery: false, width: 2400 });
    const blob = await (await fetch(p.webPath)).blob();
    return new File([blob], 'scan-' + Date.now() + '.' + (p.format || 'jpg'), { type: blob.type || 'image/jpeg' });
  } catch (e) {
    const msg = String(e && (e.message || e));
    if (/cancel/i.test(msg)) return null;
    if (/denied|permission/i.test(msg)) throw { denied: true };
    throw e;
  }
};

/* ---------- permissions + Android app settings ---------- */
const AppSettings = registerPlugin('AppSettings');
window.RK_openSettings = () => AppSettings.open();
const Bars = registerPlugin('SystemBars');
let barDark = null;
window.RK_barStyle = dark => { if (barDark === dark) return; barDark = dark; Bars.setStyle({ style: dark ? 'DARK' : 'LIGHT' }).catch(() => {}); };
window.RK_askCamera = async () => {
  try { const r = await Camera.requestPermissions({ permissions: ['camera'] }); return r.camera === 'granted' || r.camera === 'limited'; }
  catch (e) { return false; }
};

/* ---------- capabilities the page asks for ---------- */
window.claude = { use: async n => n === 'sample' ? sample : n === 'downloads' ? downloads : null };

/* ---------- Android back button ---------- */
App.addListener('backButton', () => { if (!(window.RK_back && window.RK_back())) App.exitApp(); });
