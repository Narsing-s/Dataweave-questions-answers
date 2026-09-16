# DataWeave Lab Account Security

## Current account model

DataWeave Lab uses a browser-only learning account. The account registry and active session are stored in the browser's local storage.

### Account creation rules

1. Username is required and must be 3–40 characters.
2. Username accepts letters, numbers, dots, underscores, spaces and hyphens.
3. Email is normalized to lowercase before uniqueness checks.
4. Password must contain at least 8 characters.
5. An email already registered in the browser cannot be registered again.
6. A username already registered in the browser cannot be registered again.
7. Successful registration creates the account and starts a session.

### Login rules

Login requires all three registered credentials:

- username
- email
- password

The credentials must identify the same stored account. Login never creates an account and never overwrites an existing account.

### Account deletion

Account deletion requires the registered username, email and password and an explicit confirmation. A failed credential check does not remove the account.

### Session rules

- Only the stored active user is allowed through `explorer.html`.
- Logout removes the active session and returns to the account page.
- Direct access to the learning application should be routed through the authenticated Explorer entry point.

## Security limitation

This implementation is intentionally backend-free. Local storage is controlled by the browser and can be cleared or modified by the user. The password fingerprint used by this demo is not suitable for protecting production credentials.

A production identity system requires a server-side authentication service, secure password hashing, session management, rate limiting, account recovery, email verification, and a database with unique constraints on username/email.

Do not use this browser-only account system for sensitive or production authentication.
