# ENGINEX for iPhone and iPad

This is the installable Safari home-screen web app. It shares the existing website, service-request backend and owner dashboard. It is not an App Store IPA.

## Install
1. Open https://iemfaraz.github.io/enginex-engineering-services/ in Safari on your iPhone or iPad.
2. Tap Safari Share → Add to Home Screen.
3. Keep Open as Web App enabled if that option is shown, then tap Add.
4. Open ENGINEX using its Home Screen icon.

English and Arabic installation instructions are also available on the website under Mobile apps.

## Files
- `app.webmanifest`: home-screen name, icons, scope and standalone start URL.
- `assets/app-icon-180.png`: opaque Apple touch icon.
- `assets/app-icon-192.png`, `assets/app-icon-512.png`: manifest icons.
- `ios-install.js`: installation instructions, installed-mode indicator and service-worker registration.
- `service-worker.js`, `offline.html`: offline connection fallback only.

No customer pages, submissions, messages, private photos or backend API responses are stored by the service worker. Forms and tracking require internet. Android APK download remains available separately. Validate installation, photo upload, quoting, tracking and PDF printing on real iPhone/iPad devices before broad distribution.
