# Deploy: Backend on Railway + Frontend on Vercel

- **Backend (API + Socket.io)** → [Railway](https://railway.app)
- **Frontend (React/Vite)** → [Vercel](https://vercel.com)

---

## Before you start

- Code on **GitHub**.
- **MongoDB** (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free).
- If you use them: **Google OAuth**, **Cloudinary**, **email** keys (same as local `.env`).

---

# Part 1: Backend on Railway

## Step 1: Create project on Railway

1. Go to **https://railway.app** and sign in (e.g. with GitHub).
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** and select your repository.
4. Railway creates a service. Click on it to open **Settings**.

## Step 2: Configure the backend service

1. In the service **Settings**, set **one** of these:

   **Option A – Repo root is the folder that contains `TransportConnect/` (e.g. “tr” or your repo root)**  
   - **Root Directory:** leave **empty**.  
   - **Build Command:** `npm install`  
   - **Start Command:** leave empty (uses `npm start` from root `package.json`, which runs the backend).  
   A root `package.json` with `"start": "node TransportConnect/TransportConnect-/backend/server.js"` was added so Railway finds it.

   **Option B – Repo root is the app folder (you see `backend/`, `frontend/`, `package.json` at top level)**  
   - **Root Directory:** leave **empty**.  
   - **Build Command:** `npm install`  
   - **Start Command:** `node backend/server.js` (or leave empty to use `npm start` from that `package.json`).

   **Option C – Repo root is the parent of the app folder (you see `TransportConnect/` at top level)**  
   - **Root Directory:** `TransportConnect` (or leave empty if Railway already uses this).  
   - **Build Command:** `cd TransportConnect- && npm install`  
     (This installs backend deps into `TransportConnect/TransportConnect-/node_modules` so the server finds `express`.)  
   - **Start Command:** `cd TransportConnect- && node backend/server.js` (or leave empty to use `npm start` from `TransportConnect/package.json`).

2. Under **Variables** (or **Environment**), add at least:

   | Key | Value |
   |-----|--------|
   | `MONGO_URL` or `MONGODB_URI` | Your MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname`) |
   | `JWT_SECRET` | Long random string (32+ chars) |
   | `FRONTEND_URL` | Leave empty for now; set after Vercel deploy (e.g. `https://your-app.vercel.app`) |

   Add the rest from your local `.env` if you use them: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `CLOUDINARY_*`, `EMAIL_*`, etc.

3. **Generate domain:** In the service, open **Settings** → **Networking** → **Generate Domain** (or **Public Networking**). Copy the URL (e.g. `https://transportconnect-api-production-xxxx.up.railway.app`).

4. Trigger a **Deploy** (or push a commit). Wait until the deploy is **Success**.

5. **Save the backend URL** – you need it for Vercel and for `FRONTEND_URL` / Google callback.

---

# Part 2: Frontend on Vercel

## Step 3: Deploy frontend on Vercel

1. Go to **https://vercel.com** and sign in (e.g. with GitHub).
2. Click **Add New** → **Project**.
3. **Import** your GitHub repository.
4. Configure the project:
   - **Framework Preset:** Vite (or leave auto).
   - **Root Directory:** click **Edit** and set to `TransportConnect/TransportConnect-/frontend`.
   - **Build Command:** `npm run build` (default for Vite).
   - **Output Directory:** `dist` (default).
   - **Install Command:** `npm install` (default).

5. **Environment Variables** – add (use your **full** Railway backend URL **with `https://`**):

   | Name | Value |
   |------|--------|
   | `VITE_API_BASE_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` |
   | `VITE_SOCKET_URL`   | `https://YOUR-RAILWAY-URL.up.railway.app` |

   ⚠️ **Must be a full URL:** include `https://`. If you omit it, the app will send requests to your Vercel domain (e.g. `/transportconnect-production.up.railway.app/auth/login`) and you’ll get 405.

   Example: if Railway URL is `https://transportconnect-production.up.railway.app`:
   - `VITE_API_BASE_URL` = `https://transportconnect-production.up.railway.app/api`
   - `VITE_SOCKET_URL`   = `https://transportconnect-production.up.railway.app`

6. Click **Deploy**. Wait until the build finishes.

7. Copy your **Vercel URL** (e.g. `https://transportconnect-xxx.vercel.app`).

---

# Part 3: Connect backend and frontend

## Step 4: Set FRONTEND_URL on Railway

1. In **Railway** → your backend service → **Variables**.
2. Set **FRONTEND_URL** to your Vercel URL (no trailing slash), e.g. `https://transportconnect-xxx.vercel.app`.
3. Save. Railway will redeploy so CORS allows the frontend.

## Step 5: SPA routing on Vercel (no 404 on refresh)

The repo already has a `vercel.json` in `TransportConnect/TransportConnect-/frontend/` with rewrites so all routes serve `index.html`. With **Root Directory** = `TransportConnect/TransportConnect-/frontend`, Vercel uses that file. If you still get 404 on routes like `/dashboard`:

1. In Vercel → your project → **Settings** → **Functions** or **General**.
2. Or add in **Project Settings** → **Rewrites**: Source `/(.*)` → Destination `/index.html`.

---

# Part 4: Google login (if you use it)

1. In [Google Cloud Console](https://console.cloud.google.com/) → your OAuth client → **Authorized redirect URIs**.
2. Add: `https://YOUR-RAILWAY-URL.up.railway.app/api/auth/google/callback`
3. In **Railway** → backend **Variables**:  
   `GOOGLE_CALLBACK_URL` = `https://YOUR-RAILWAY-URL.up.railway.app/api/auth/google/callback`

---

# Summary

| What | Where | URL |
|------|--------|-----|
| Backend | Railway | `https://xxx.up.railway.app` |
| Frontend | Vercel | `https://xxx.vercel.app` |

- **Railway:** Backend stays on; free tier has a monthly usage limit.
- **Vercel:** Frontend is static; free tier is generous and no 404 issues when `vercel.json` rewrites are applied (Root Directory = frontend folder).

---

# Troubleshooting (Railway)

**“Missing script: start” / crash after deploy**

Railway is running from a folder whose `package.json` has no `start` script. Set Root Directory and Start Command as in Step 2 (Option A/B/C).

**“Cannot find package 'express'” (ERR_MODULE_NOT_FOUND)**

Railway is running the server from `TransportConnect/TransportConnect-/` but `npm install` ran in the parent `TransportConnect/`, so `node_modules` (with express) is in the wrong place.

1. In Railway → your backend service → **Settings**.
2. Set **Build Command** to: **`cd TransportConnect- && npm install`**  
   (so dependencies are installed inside `TransportConnect/TransportConnect-/node_modules`).
3. **Start Command** can stay: **`cd TransportConnect- && node backend/server.js`** (or leave empty to use `npm start`).
4. Save and **Redeploy**.

**“Error connecting to database”**

The backend needs **MONGO_URL** (and other secrets) as **environment variables in Railway**. The `.env` file is not deployed (and should not be in Git).

1. In Railway → your backend service → **Variables** (or **Environment**).
2. Add **MONGO_URL** = your MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME?retryWrites=true&w=majority`). Replace `USER`, `PASSWORD`, cluster host, and `DBNAME` with your values.
3. Add **JWT_SECRET** (long random string) and **FRONTEND_URL** (your Vercel URL, e.g. `https://your-app.vercel.app`).
4. Optional: **GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET**, **GOOGLE_CALLBACK_URL** (use your Railway backend URL in the callback), **CLOUDINARY_***, **EMAIL_***, etc., same as in your local `.env`.
5. Save (Railway will redeploy). The app reads `process.env.MONGO_URL` or `process.env.MONGODB_URI`; Railway injects Variables into `process.env`.

**“MongooseError: Operation \`users.findOne()\` buffering timed out after 10000ms”**

This means the app accepted a request before MongoDB was connected (or the DB is unreachable).

1. **Code fix (done):** The server now connects to the database **before** calling `listen()`, so no requests are handled until the DB is ready.
2. **MongoDB Atlas – Network Access:** Railway’s IPs are dynamic. In [Atlas](https://cloud.mongodb.com) → **Network Access** → **Add IP Address** → choose **“Allow Access from Anywhere”** (`0.0.0.0/0`). Save. Without this, Atlas blocks Railway’s requests.
3. **Env var on Railway:** Ensure **MONGO_URL** (or **MONGODB_URI**) is set in Railway → your service → **Variables** to your full Atlas connection string (with password encoded if it contains special characters).
4. **Redeploy** after changing Variables so the new connection logic and env are used.
