# Receipt Keeper — Team Rocket · Product Anatomy C1

A bill-capture app for India: scan paper and thermal receipts, get clean PDFs, and find any bill in seconds. Bills are filed by category automatically and never leave the phone.

**Design:** [Figma — Wireframes & UI](https://www.figma.com/design/FKZWBQmAAOfqgTGNgQrwfA/billQR?node-id=98-2) · interactive prototype on page *05 · Interactive prototype*

## What it does (v1.7)

| Area | Features |
|---|---|
| Onboarding | 4 screens (value props + permissions explained before asking) |
| Capture | Live scanner that fires only when a bill is in view, auto-crop, manual crop, up to 4 bills in one shot, long-receipt stitching, gallery / PDF / pasted SMS-UPI import |
| Reading | OCR.space (free) by default, optional Claude API key for messy bills; low-confidence fields are flagged and need one "All details look right" tick |
| Storage | Each bill saved as a PDF in `Documents/ReceiptKeeper/<Category>/`, backup & restore file |
| Browse | Vault list + calendar view, search with filters, categories, folders, multi-select (move / category / PDF / delete with undo) |
| States | Empty, offline, camera-blocked, no-bill-in-view and couldn't-read states |

## Project structure

```
src/
  body.html     app shell (nav rail, FAB, overlays)
  app.js        core app: routing, storage (IndexedDB), scanner, OCR parsing, PDF export
  ui.js         pastel UI layer from the Figma file (screens, sheets, motion)
  wf.css extra.css native.css pastel.css   styles (pastel.css = current visual)
  shim.js       native bridge (Capacitor camera, files, share, OCR.space, Claude, system bars)
  keys.example.js   copy to keys.js and add your OCR.space key
  manrope.woff2 font, embedded at build time
android/        Capacitor Android project (AppSettingsPlugin.java opens app permissions)
build-web.py    assembles www/index.html from src/
```

## Build the APK

Needs Node 20+, Python 3, JDK 21 and Android SDK 36.

```bash
npm install
cp src/keys.example.js src/keys.js          # then paste your OCR.space key
mkdir -p www && cp -r vendor/libs www/          # jsPDF + pdf.js, bundled for offline use
npx esbuild src/shim.js --bundle --format=iife --minify --target=chrome61 --outfile=www/shim.js
python3 build-web.py
npx cap sync android
cd android && ./gradlew assembleRelease
```

Release signing reads `android/keystore.properties` (not in the repo). Ask the project owner for the keystore — every update must be signed with the same key or phones will refuse to install it over the old version.

## Team

Team Rocket — Product Anatomy cohort 1.
