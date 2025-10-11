# TaskFlow API

TaskFlow is a Node.js + Express backend that currently focuses on user authentication. It demonstrates secure credential
storage, JSON Web Token (JWT) based sessions, and a lightweight file-backed data store that keeps user information between
restarts.

## Features

- User registration with server-side validation.
- Secure password hashing using `bcryptjs`.
- JWT issuance on login for stateless authentication.
- File-backed user store that persists credentials across restarts.
- Automated integration tests covering the authentication flow.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (optional) to override defaults:
   ```env
   PORT=5000
   JWT_SECRET=choose-a-long-random-string
   USER_DATA_FILE=./data/users.json
   ```
   - `JWT_SECRET` should always be set to a strong random value in production.
   - `USER_DATA_FILE` can point to any writable path if you want to isolate data per environment.
3. Start the API:
   ```bash
   npm start
   ```
4. The service listens on `http://localhost:5000` by default. A health check is available at `/`.

## Authentication API

All routes expect and return JSON.

### `POST /auth/register`
Registers a new user.

Request body:
```json
{
  "username": "demo-user",
  "password": "super-secret-password"
}
```

Validation rules:
- `username` and `password` are required.
- Passwords must be at least 8 characters long.
- Usernames must be unique.

Responses:
- `201 Created` on success.
- `400 Bad Request` when validation fails.
- `409 Conflict` when the username already exists.

### `POST /auth/login`
Authenticates a user and returns a JWT access token.

Request body matches the registration format.

Responses:
- `200 OK` with `{ message, token, expiresIn }` when the credentials are correct.
- `400 Bad Request` for validation errors.
- `401 Unauthorized` when the credentials do not match a known user.

Include the returned token as a `Bearer` token in the `Authorization` header to protect future endpoints.

## Testing

Run the automated test suite with:
```bash
npm test
```

The tests use an isolated temporary data file so they do not interfere with local development data.

## Project Structure

```
├── auth.js          # Authentication routes
├── index.js         # Express application entry point
├── lib/
│   └── userStore.js # File-backed user persistence
├── data/
│   └── README.md    # Notes about the file-backed datastore location
├── __tests__/
│   └── auth.test.js # Integration tests for the auth flow
└── README.md
```

## Next Steps

- Add role-based access control and protected routes for future task management features.
- Replace the file data store with a production-ready database (PostgreSQL, MongoDB, etc.).
- Implement task CRUD endpoints that leverage authenticated user context.
- Extend the test suite with negative cases, token verification, and future domain logic.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
