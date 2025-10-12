# Copilot Instructions for TaskFlow

## Overview
TaskFlow is a Node.js + Express backend focused on user authentication. It demonstrates secure credential storage, JWT-based sessions, and a file-backed user store. The codebase is intentionally simple, with all logic in a few files for clarity and ease of extension.

## Architecture & Key Files
- `index.js`: Express app entry point. Sets up middleware, loads routes, and starts the server.
- `auth.js`: Defines `/auth/register` and `/auth/login` endpoints. Handles validation, password hashing, JWT issuance, and error responses.
- `lib/userStore.js`: Implements a file-backed user store. Handles user persistence, uniqueness checks, and password storage.
- `data/`: Default location for user data file. Path can be overridden via `USER_DATA_FILE` env variable.
- `__tests__/auth.test.js`: Integration tests for the authentication flow. Uses a temp data file to avoid polluting real data.

## Developer Workflows
- **Install dependencies:** `npm install`
- **Run the server:** `npm start` (uses `PORT`, `JWT_SECRET`, `USER_DATA_FILE` from `.env` if present)
- **Run tests:** `npm test` (tests are isolated from dev data)
- **Environment config:** Use a `.env` file to override defaults. See `README.md` for variable details.

## Project-Specific Patterns
- All API endpoints expect and return JSON.
- Passwords are hashed with `bcryptjs` before storage.
- JWTs are issued on login and must be sent as a Bearer token for protected endpoints (future work).
- Usernames must be unique; password must be at least 8 chars.
- Error responses use standard HTTP codes: 400 (validation), 401 (auth), 409 (conflict), 201 (created), 200 (success).
- The user store is file-backed for demo/dev; production should use a real DB.
- Tests do not touch production data—see test setup for temp file logic.

## Extending the Project
- Add new endpoints in `auth.js` or new route files, then mount in `index.js`.
- For new data models, create a new file in `lib/` following the `userStore.js` pattern.
- To add protected routes, require JWT validation middleware (see `auth.js` for JWT logic).

## Examples
- Register: `POST /auth/register` with `{ username, password }`
- Login: `POST /auth/login` with `{ username, password }` → returns `{ token }`

## References
- See `README.md` for API and setup details.
- See `lib/userStore.js` for persistence logic and conventions.
- See `__tests__/auth.test.js` for integration test patterns.

---
For questions about conventions or structure, check the README or ask for examples from the files above.