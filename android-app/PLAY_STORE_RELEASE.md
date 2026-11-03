# ENGINEX Google Play release preparation

Prepared 3 November 2026. Package: `com.enginex.services`. Release version: 1.0.1 (2). Target API: Android 16 / API 36. Minimum: Android 8 / API 26.

## Publication status
Not uploaded or published. The automatic build creates an **unsigned** Android App Bundle (`app-release.aab`) until the owner supplies an upload signing key. An unsigned AAB and the debug APK cannot be uploaded as a Play release.

## Owner-controlled signing
Use Android Studio → Build → Generate Signed Bundle/APK → Android App Bundle → Create new upload keystore. Keep the keystore and passwords in your own secure storage; do not put them in chat or commit them to the repository.

To use the GitHub release build, add these four repository Actions secrets through GitHub Settings → Secrets and variables → Actions:
- `ANDROID_UPLOAD_KEYSTORE_BASE64` — base64 of your upload keystore
- `ANDROID_UPLOAD_STORE_PASSWORD`
- `ANDROID_UPLOAD_KEY_ALIAS`
- `ANDROID_UPLOAD_KEY_PASSWORD`

Run **Build ENGINEX Android app** manually and enable `sign_release`. The workflow decodes the keystore into the runner's temporary directory, signs the release, uploads the AAB and removes the temporary key. Download `enginex-playstore-bundle-signed`. Keep the same upload key for future updates. Opt into Play App Signing in Play Console.

Without those secrets, push builds produce `enginex-playstore-bundle-unsigned` for verification only. Do not upload that unsigned artifact to Play Console.

## Store listing draft
App name: ENGINEX Engineering Services

Short description: Request maintenance, upload photos and track your ENGINEX service enquiry.

Full description:
ENGINEX Engineering Services helps you request home, office and property maintenance in Saudi Arabia.

Explore electrical maintenance, air conditioning, plumbing and water, general property care, low-current systems and planned maintenance. Small electrical requests are welcome, including sockets, switches, fans, breaker faults and room or home wiring enquiries.

Describe the work, enter your city or neighbourhood and optionally attach photos. After successful submission, keep your ENGINEX reference to track your request using the same email address.

View request progress, customer-visible updates, shared quotations and agreed visit information. Send messages to ENGINEX through tracking. You can also open your phone, WhatsApp or email app to contact us.

The app supports English and Arabic. Native service screens remain available offline; submitting requests and checking tracking require internet access. Service availability, scope, price and visit arrangements are confirmed with ENGINEX before work begins.

Support: faraznawaz2014@gmail.com
Website: https://iemfaraz.github.io/enginex-engineering-services/
Privacy policy: https://iemfaraz.github.io/enginex-engineering-services/privacy.html
Suggested category: House & Home. Confirm audience, rating and all declarations in Play Console. No ads or in-app billing are implemented.

## Data safety review worksheet
Review against the live backend before submitting; this is not an automatic Console declaration.

- Collected for app functionality: name, email, phone, typed city/area, issue description, service and scheduling preferences, submitted messages, optional photos, quotations and related service records.
- Device location permission/GPS: not used. Classify the user's typed city/area under the appropriate location/address categories when completing Google's questionnaire.
- Photos: optional, selected through the system picker.
- Messages: customer/ENGINEX in-app messages associated with a request.
- Network information: hosting providers process connection metadata. The backend keeps a daily IP-derived hash for rate limiting.
- Encryption in transit: HTTPS.
- Deletion/correction: email the published support contact with the request reference and matching email.
- No customer account creation, ad SDK, analytics SDK, advertising ID, contacts permission, payment card collection or in-app digital purchases.
- Hosting providers process data to run the service; review Google's service-provider exceptions before answering the data-sharing questions. Do not select “No data collected.”

## Remaining Console steps
1. Sign in to an existing Play Console developer account, or register and complete Google's required payment/identity/device verification yourself.
2. Create the app and verify the package/brand and contact information. Review and accept required agreements yourself.
3. Upload an owner-signed AAB to internal testing first and configure Play App Signing.
4. Add real app screenshots and the required icon/feature graphic; do not use fabricated screenshots as proof of app behaviour.
5. Complete privacy policy, data safety, ads, target audience, content rating, app access and any other required declarations using the current Console questions.
6. Test quotes, 150 MB image handling, replies, tracking, printing, external contact links, offline/retry, English/Arabic and Android 16 back navigation on phones.
7. New personal accounts may require at least 12 testers continuously opted into closed testing for 14 days before applying for production access.
8. Submit for Google's review after account setup, testing and signing are complete. Publication and approval are controlled by Google.
