# Auth — React, Tailwind & Flask Authentication Starter

A full-stack authentication starter with email/password and Google Sign-In — React + Tailwind on the frontend, Flask + JWT on the backend.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3.10%2B-3776AB?logo=python&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)


## Overview

Auth is a ready-to-run login and signup flow you can drop into any product. It covers the three ways people actually expect to sign in today — email/password and Google — with sensible security defaults out of the box: hashed passwords, signed JWTs, and server-side verification of every social login token.

**Highlights**

- 🔐 Email/password auth with hashed passwords (PBKDF2 via Werkzeug)
- 🔑 JWT-based sessions (7-day expiry, configurable)
- 🟢 Google Sign-In, verified server-side against Google's public keys
- 🎨 Polished, responsive React + Tailwind UI (split-screen auth layout)
- 🗄️ SQLite by default — zero setup, swap in Postgres/MySQL for production
- 🧩 Clean separation of concerns: reusable API client, auth context, protected routes


## Tech Stack

| Layer     | Technology                                             |
|-----------|----------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router               |
| Backend   | Flask, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-CORS   |
| Auth      | JWT (email/password), Google OAuth 2.0    |
| Database  | SQLite (dev) — swappable via `DATABASE_URL`               |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in the values — see "Configuration" below
python app.py                   # http://localhost:5000
```

SQLite creates `auth.db` automatically on first run — no migrations required to get started.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env            # fill in the values — see "Configuration" below
npm run dev                     # http://localhost:5173
```

## Configuration

### Google Sign-In

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth client ID** → Application type: **Web application**.
3. Add `http://localhost:5173` under Authorized JavaScript origins (add your production domain later).
4. Copy the Client ID into both:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID`

**How it works:** the frontend renders Google's own button and receives a signed ID token. That token is sent to `POST /api/auth/google`, where the backend verifies its signature and audience using Google's `google-auth` library — the frontend is never trusted on its own.

## Security Notes

- Passwords are hashed with Werkzeug's `generate_password_hash` (PBKDF2) — never stored in plain text.
- JWTs are signed with `JWT_SECRET_KEY` and expire after 7 days by default (`app.py`).
- Google and Facebook tokens are independently verified server-side on every request — the API never trusts a client-supplied identity without checking it against the provider.
- CORS is restricted to `FRONTEND_ORIGIN` from `backend/.env`.

## Roadmap / Suggested Next Steps

- Add rate limiting (e.g. `Flask-Limiter`) on `/login` and `/signup`.
- Add email verification and password-reset flows.
- Swap SQLite for Postgres/MySQL in production by updating `DATABASE_URL` — no code changes required, since the app uses SQLAlchemy.
- Add refresh tokens if you need sessions longer than the JWT's expiry window.

## License

MIT — free to use, modify, and build on for personal or commercial projects.
