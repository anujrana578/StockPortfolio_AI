# Complete Authentication System Documentation

## 1. Overview
FinSight provides a **Dual-Method Authentication Architecture** built onto the existing Flask REST API backend, SQLite relational database, and React + Vite frontend. Both authentication methods feed into the **same user account model in the database**.

---

## 2. Authentication Methods Supported
1. **Normal Local Authentication (Username/Email + Password):**
   * Password hashing using **bcrypt with unique salt rounds** (zero plaintext storage).
   * Validation of email syntax, password minimum length (>= 6 characters), unique username check, and unique email check.
2. **Google OAuth 2.0 / OpenID Connect ("Continue with Google"):**
   * Backend token verification.
   * Auto-registration for first-time Google users without requiring passwords.
   * Safe account linking for existing local accounts sharing verified email addresses.

---

## 3. Database Schema & User Model

The database table `users` in `finsight.db` contains:
```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,             -- NULL for Google-only users, bcrypt hash for local users
    auth_provider TEXT DEFAULT 'local', -- 'local' or 'google'
    google_id TEXT UNIQUE,          -- Google's OpenID sub (unique when present, NULL for local)
    profile_picture TEXT,           -- Avatar URL
    is_email_verified INTEGER DEFAULT 0,
    role TEXT DEFAULT 'Portfolio Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

---

## 4. API Endpoints

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registers new local user (`username`, `email`, `password`, `confirm_password`) | No |
| `POST` | `/api/auth/login` | Authenticates local user by username or email and validates bcrypt hash | No |
| `POST` | `/api/auth/google` | Verifies Google identity token, handles login / auto-creation / account linking | No |
| `GET` | `/api/auth/me` | Returns sanitized current user profile (excludes password hashes and secrets) | Yes (`Bearer <token>`) |
| `POST` | `/api/auth/logout` | Invalidates authentication session and clears cookies | No |

---

## 5. Google Cloud Configuration Guide

To configure real Google OAuth 2.0 credentials for production or custom Google Sign-In:

1. **Create or Open a Project:**
   * Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. **Configure OAuth Consent Screen:**
   * Navigate to **APIs & Services > OAuth consent screen**.
   * User Type: `External`.
   * Fill Application Name (e.g. *FinSight*), Support Email, and Developer Contact Email.
   * Add Scopes: `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
3. **Create Credentials:**
   * Navigate to **APIs & Services > Credentials**.
   * Click **+ CREATE CREDENTIALS > OAuth client ID**.
   * Application Type: `Web application`.
   * **Authorized JavaScript Origins:**
     * `http://localhost:5173`
     * `http://127.0.0.1:5173`
   * **Authorized Redirect URIs:**
     * `http://localhost:5173/auth/google/callback`
4. **Configure Environment Variables:**
   * Copy the generated **Client ID** and **Client Secret** into your `.env` file:
     ```env
     GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your_client_secret
     GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
     ```

---

## 6. Security Considerations & Protections Implemented
* **Password Hashing:** Stored exclusively with **bcrypt** salted hashes.
* **Token Security:** Standard HS256 JWT tokens with 7-day expiration.
* **Safe Account Linking:** Existing local accounts are not duplicated when signing in via Google with the same email.
* **Data Sanitization:** Endpoints never expose `password_hash`, tokens, or private secrets in responses.
* **Input Validation:** Email regex and length checks prevent invalid input or malformed payloads.

---

## 7. Running & Testing

### Run Backend Unit Tests:
```bash
python test_auth.py
```
*(Runs 6 comprehensive test suites checking registration, duplicate handling, login validation, bcrypt verification, Google SSO simulation, and token authorization).*

### Start Servers:
```bash
# Terminal 1 - Backend
python app.py

# Terminal 2 - Frontend
npm run dev
```
