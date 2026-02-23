# Deploy TransportConnect on Render – Simple guide (from scratch)

No Blueprint. Two services: **Backend** (Web Service) then **Frontend** (Static Site).

---

## Before you start

- Code is on **GitHub** (your repo).
- You have: **MongoDB** (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free), and if you use them: **Google OAuth** and **Cloudinary** keys.

---

# Part 1: Deploy the backend

## Step 1: Open Render and sign in

1. Go to **https://render.com** and sign up / log in (e.g. with GitHub).

## Step 2: Create a Web Service (backend)

1. Click **Dashboard** (or **New +**).
2. Click **Web Service**.
3. Connect your GitHub account if asked, then **select your repository** (the one that contains `TransportConnect/TransportConnect-/` or your app folder).
4. Use these settings:

   | Field | Value |
   |-------|--------|
   | **Name** | `transportconnect-api` (or any name) |
   | **Region** | Oregon (or closest to you) |
   | **Branch** | `main` (or your default branch) |
   | **Root Directory** | `TransportConnect/TransportConnect-` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `node backend/server.js` |
   | **Plan** | Free |

5. Click **Advanced** and add **Environment Variables**. Add at least:

   | Key | Value |
   |----|--------|
   | `MONGO_URL` | Your MongoDB connection string (e.g. from Atlas: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname`) |
   | `JWT_SECRET` | A long random string (e.g. 32+ characters) |
   | `FRONTEND_URL` | Leave empty for now; you’ll set it after deploying the frontend |

   If you use Google login, Cloudinary, or email, add the same keys as in your local `.env` (e.g. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `CLOUDINARY_*`, `EMAIL_*`).

6. Click **Create Web Service**. Wait until the deploy finishes and the service is **Live**.

7. Copy the service URL (e.g. `https://transportconnect-api.onrender.com`). You’ll need it for the frontend.

---

# Part 2: Deploy the frontend

## Step 3: Create a Static Site (frontend)

1. In Render Dashboard, click **New +** → **Static Site**.
2. Select the **same repository** as before.
3. Use these settings:

   | Field | Value |
   |-------|--------|
   | **Name** | `transportconnect-web` (or any name) |
   | **Branch** | `main` (or your default branch) |
   | **Root Directory** | `TransportConnect/TransportConnect-/frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |
   | **Plan** | Free |

4. Under **Environment Variables**, add (replace with your real backend URL):

   | Key | Value |
   |----|--------|
   | `VITE_API_BASE_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |
   | `VITE_SOCKET_URL` | `https://YOUR-BACKEND-URL.onrender.com` |

   Example: if backend URL is `https://transportconnect-api.onrender.com`, then:
   - `VITE_API_BASE_URL` = `https://transportconnect-api.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://transportconnect-api.onrender.com`

5. Click **Create Static Site**. Wait until the build finishes and the site is **Live**.

6. Copy the frontend URL (e.g. `https://transportconnect-web.onrender.com`).

---

# Part 3: Connect frontend and backend

## Step 4: Set FRONTEND_URL on the backend

1. Go to your **backend** service (transportconnect-api) in the Render Dashboard.
2. Open **Environment**.
3. Set **FRONTEND_URL** to your frontend URL (no trailing slash), e.g. `https://transportconnect-web.onrender.com`.
4. Save. Render will redeploy the backend automatically.

## Step 5: SPA routing (no 404 on refresh)

1. Go to your **frontend** service (transportconnect-web).
2. Open **Settings**.
3. Find **Redirects / Rewrites** (or **Redirects**).
4. Add a **Rewrite** rule:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   
   Or if there’s a single option like **“Rewrite all requests to /index.html”**, turn it **On**.

5. Save. Your app routes (e.g. `/dashboard`, `/login`) will load correctly on refresh.

---

# Part 4: Google login (if you use it)

1. In [Google Cloud Console](https://console.cloud.google.com/) → your project → **APIs & Services** → **Credentials** → your OAuth client.
2. Under **Authorized redirect URIs**, add:  
   `https://YOUR-BACKEND-URL.onrender.com/api/auth/google/callback`
3. In Render, on the **backend** service → **Environment**, set:
   - `GOOGLE_CALLBACK_URL` = `https://YOUR-BACKEND-URL.onrender.com/api/auth/google/callback`

---

# Done

- **Frontend:** open your static site URL (e.g. `https://transportconnect-web.onrender.com`).
- **Backend:** runs at your Web Service URL; the frontend calls it via `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.

**Free tier:** backend may sleep after ~15 min of no traffic; the first request after that can be slow (cold start). Frontend stays on.
