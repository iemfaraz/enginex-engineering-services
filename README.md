# ENGINEX Engineering Services

English/Arabic maintenance website. Contact: faraznawaz2014@gmail.com.

## Enquiries

The form prepares a mailto link. Visitors must review and send the email in their mail app. It does not silently submit or guarantee delivery. Phone / WhatsApp: +966551679504. Visitors can also open a prepared WhatsApp message and send it themselves.

## Email dashboard

Open dashboard.html. Enable Gmail API in Google Cloud, configure Google Auth Platform consent, add faraznawaz2014@gmail.com as a test user while in Testing, create an OAuth Web application client, and authorize JavaScript origin https://iemfaraz.github.io. Configure gmail.readonly and gmail.send scopes. Enter the public client ID in the dashboard and connect the owner Gmail account. Never put a client secret or password in this repository. The mailbox must already exist.

Access tokens live only in memory and expire; reconnect as needed. Messages render as plain text. The dashboard reads/searches Gmail, opens messages and sends replies after the owner clicks Send. Email data is fetched directly from Google and is not stored in the public repo. Google setup and real-account authorization are still required; live Gmail reading/sending has not been verified. OAuth app testing/verification requirements are controlled by Google.

## Deploy

GitHub Actions publishes index.html and dashboard.html on each push to main.

## Quote database dashboard

Website submissions now POST to https://enginex-quote-dashboard.faraznawaz2014.chatgpt.site/api/quotes and are stored in a hosted D1 database. A success reference is shown only after the server confirms storage. Duplicate retries use the same reference. Requests are validated and rate-limited. Email and WhatsApp remain optional additional contact methods.

Review dashboard: https://enginex-quote-dashboard.faraznawaz2014.chatgpt.site — sign in with the ChatGPT account whose email is faraznawaz2014@gmail.com. Anonymous users cannot read or update stored quotes. Owner controls include search, statuses, internal notes and contact links. Only the latest 1,000 requests are loaded by this dashboard version. Gmail OAuth setup is not needed for quote storage.

Backend source is maintained in the separate ENGINEX Quote Dashboard Site source repository; GitHub Pages hosts this public frontend. Earlier mailto-only requests were never stored and cannot be recovered automatically.
