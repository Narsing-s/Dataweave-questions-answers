# Login and first-login greeting

DataWeave Lab now has a browser-only login at `login.html`.

## What it does

- Collects name, email and password in the browser.
- Stores only the name/email learning identity in `localStorage`.
- Redirects returning users to the Explorer.
- On the first successful login on that browser, opens a pre-addressed greeting email using `mailto:`.

## Important security limitation

This is intentionally **not a real authentication system**. There is no backend, database, session server or password verification. Do not use it for sensitive credentials.

A normal browser page cannot silently send an email through the user's mailbox without either a mail client handoff (`mailto:`) or an external email service/backend. Because this project is required to remain backend-free, the first-login greeting opens the user's email application with the greeting already prepared; the user must press Send.

If true automatic sending is required later, an email provider such as EmailJS or a small serverless email endpoint can be connected without changing the learning UI, but that would no longer be a completely backend-free email flow.
