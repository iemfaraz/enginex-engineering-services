# ENGINEX Services for Android

A customer Android app for ENGINEX Engineering Services in Saudi Arabia.

## Included
- Native English/Arabic home, service cards and contact screens, with bundled equipment photography.
- Home / Services / Quote / Track / Contact bottom navigation.
- The existing live ENGINEX quote form and tracker inside an HTTPS WebView, styled for the app.
- Requests, tracking numbers, photos, quotations and messages use the same backend and owner dashboard as the website.
- Android document picker for up to three JPG/PNG/WebP photos. The website enforces 150 MB per image and offers optional optimization.
- Quotation document window with Android Print / Save as PDF.
- Call, WhatsApp, email and sharing actions.
- Native service pages work without a connection; submissions and tracking need internet.
- No embedded admin token, advertising SDK, analytics SDK or new customer database.

Website: https://iemfaraz.github.io/enginex-engineering-services/
Dashboard: https://iemfaraz.github.io/enginex-engineering-services/dashboard.html

## Download an APK
In the repository, open **Actions → Build ENGINEX Android app**. Open a successful run and download **enginex-android-debug-apk** from its Artifacts section. Unzip it, transfer `enginex-android-debug.apk` to your Android phone, and open it. Android may ask you to allow installation from that source.

This is a debug-signed test build, not a Google Play publication. The automatic runner creates a fresh debug signing identity; a later build may require uninstalling an earlier test build before installation. Use an owner-controlled release signing key before distributing updates to customers.

## Open in Android Studio
Open this `android-app` directory in Android Studio. The project uses Android Gradle Plugin 8.7.3, Gradle 8.9, JDK 17, Android SDK 35 and minimum Android 8 (API 26). Android Studio can generate a Gradle wrapper with the installed Gradle distribution if one is needed. The GitHub workflow installs Gradle directly and does not depend on a wrapper.

Command line with Gradle 8.9 installed:

```
gradle :app:assembleDebug :app:lintDebug
```

The APK is written to `app/build/outputs/apk/debug/app-debug.apk`.

## Before a public store release
Prepare an owner-controlled signing key, a release build, a public privacy policy URL and the required Play Console listing/data-safety disclosures. Verify uploads, Arabic layout, WhatsApp, quotation PDF, offline/retry and tracking on real phones. This repository does not claim Play Store approval or publication.

## Security and maintenance
The app loads only the ENGINEX GitHub Pages path inside its main WebView. Other HTTPS, telephone and email links open external apps. Cleartext traffic and file URL access are disabled. TLS errors are cancelled. No JavaScript/native bridge is exposed. Update the Android System WebView on test devices.

Native services and artwork are bundled. Website forms, tracking, prices, customer messages and shared quotations reflect live website/backend updates. Native branding or service copy changes require another APK build.
