# Receipt Keeper — Team Rocket · Product Anatomy C1

A bill-capture app for India: scan paper and thermal receipts, get clean PDFs, and find any bill in seconds. Bills are filed by category automatically and never leave the phone.

**Design:** [Figma — Wireframes & UI](https://www.figma.com/design/FKZWBQmAAOfqgTGNgQrwfA/billQR?node-id=98-2) ·
**OCR key for the app need to be created : {K89316855588957}. **https://ocr.space/ocrapi/freekey

## What it does (v1.7) also on the

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
cp src/keys.example.js src/keys.js          # then paste your OCR.space key : K89316855588957
mkdir -p www && cp -r vendor/libs www/          # jsPDF + pdf.js, bundled for offline use
npx esbuild src/shim.js --bundle --format=iife --minify --target=chrome61 --outfile=www/shim.js
python3 build-web.py
npx cap sync android
cd android && ./gradlew assembleRelease
```

Release signing reads `android/keystore.properties` (not in the repo). Ask the project owner for the keystore — every update must be signed with the same key or phones will refuse to install it over the old version.

## Team Testing

### Option 1 — Download the latest APK

The latest signed test APK is available in GitHub Releases.

[Download the latest Receipt Keeper APK]: (https://github.com/Molades/Team-Rocket--Receipt-Manager--Product-Anatomy-C1/releases/latest](https://github.com/Molades/Team-Rocket--Receipt-Manager--Product-Anatomy-C1/releases/latest)

Install the APK on an Android phone and use it for bootcamp testing.

### Option 2 — Clone and test the code

Team members can clone the repository, make changes, and build a **debug APK** to test their work.

```bash
git clone https://github.com/Molades/Team-Rocket--Receipt-Manager--Product-Anatomy-C1.git
cd Team-Rocket--Receipt-Manager--Product-Anatomy-C1

npm install

mkdir -p www
cp -r vendor/libs www/
npx esbuild src/shim.js --bundle --format=iife --minify --target=chrome61 --outfile=www/shim.js
python3 build-web.py
npx cap sync android

cd android
./gradlew assembleDebug

## Team

Team Rocket — Product Anatomy cohort 1.
