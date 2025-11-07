# Authentication Backend

This is the Express + MongoDB backend for the MERN Authentication example.

## Quick start

1. Copy `.env.example` to `.env` and fill the values (optional):

   - `MONGO_URI` — MongoDB connection string (Atlas) (optional; if omitted server will run but DB features will be disabled)
   - `JWT_SECRET` — secret used to sign JWTs
   - `PORT` — optional port (default 5000)

2. Install dependencies and run:

```powershell
cd Authentication-Backend
npm install
npm run start        # starts nodemon and reloads on changes
# or
npm run start:node   # starts with node (no watcher)
```

3. API endpoints

- POST /api/auth/register — register a user (body: { username, email, password })
- POST /api/auth/login — login (body: { email, password })

Notes:
- If you don't provide `MONGO_URI`, the server will start but registration/login will not persist.
- Ensure `JWT_SECRET` is set before using auth endpoints in production.
