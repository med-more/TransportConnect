# Deploy TransportConnect on Render.com

Deploy both **frontend** (static site) and **backend** (Node/Express + Socket.io) on [Render.com](https://render.com). Free tier available for both.

---

## 1. Prepare the repo

- Push your code to **GitHub** (or GitLab/Bitbucket).
- Ensure `render.yaml` is in the repo at: **`TransportConnect/TransportConnect-/render.yaml`** (or at the root you will set in step 2).

---

## 2. Create a Render account and project

1. Go to [render.com](https://render.com) and sign up (GitHub login is easiest).
2. **Dashboard** → **New** → **Blueprint**.
3. Connect your repository and choose the repo.
4. Set **Root Directory** to the folder that contains `render.yaml` and both `frontend/` and `backend/`:
   - If your repo root is the project: leave empty or `.`
   - If your repo is e.g. `tr` and the app is in `TransportConnect/TransportConnect-/`: set **`TransportConnect/TransportConnect-`**
5. Render will detect `render.yaml` and create two services: **transportconnect-api** (backend) and **transportconnect-web** (frontend).

---

## 3. Backend environment variables

In **transportconnect-api** → **Environment** add (same names as your local `.env`):

| Key | Value | Required |
|-----|--------|----------|
| `MONGO_URL` | Your MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`) | Yes |
| `JWT_SECRET` | Long random string (or use Render’s “Generate” if available) | Yes |
| `FRONTEND_URL` | Your frontend URL on Render, e.g. `https://transportconnect-web.onrender.com` (no trailing slash) | Yes |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | If using Google login |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | If using Google login |
| `GOOGLE_CALLBACK_URL` | `https://<your-backend-url>/api/auth/google/callback` (use the backend URL Render gives you) | If using Google login |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | If using avatars |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | If using avatars |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | If using avatars |
| `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`, etc. | Same as local | If using email |

- **PORT**: Render sets this automatically; you don’t need to add it.
- In **Google Cloud Console** → your OAuth client → **Authorized redirect URIs**, add:  
  `https://<your-backend-url>/api/auth/google/callback`

---

## 4. Deploy backend first

1. Save the environment variables and let the **backend** deploy.
2. When it’s live, copy the backend URL, e.g. `https://transportconnect-api.onrender.com`.

---

## 5. Frontend environment variables and SPA routing

1. Open **transportconnect-web** (static site) → **Environment**.
2. Add (use the **exact** backend URL from step 4):

   | Key | Value |
   |-----|--------|
   | `VITE_API_BASE_URL` | `https://<your-backend-url>/api` (e.g. `https://transportconnect-api.onrender.com/api`) |
   | `VITE_SOCKET_URL` | `https://<your-backend-url>` (e.g. `https://transportconnect-api.onrender.com`) |

3. **Save** and trigger a **Manual Deploy** (or push a commit) so the frontend rebuilds with these URLs.
4. **SPA routing (fix 404 on refresh):**  
   In **transportconnect-web** → **Settings** → find **Rewrite / Redirect** (or similar). Add a rule:
   - **Rewrite**: all requests → `/index.html`  
   Or in the UI it may be a checkbox like “Rewrite all requests to `/index.html`” for SPAs. Enable it.

---

## 6. Point frontend to backend

1. In **transportconnect-api** → **Environment**, set:
   - `FRONTEND_URL` = your frontend URL, e.g. `https://transportconnect-web.onrender.com`
2. Redeploy the backend if you just added or changed `FRONTEND_URL`.

---

## 7. Free tier notes

- **Backend**: Free services spin down after ~15 min of no traffic; first request after that may be slow (cold start).
- **Frontend**: Static site is always on; no spin-down.
- **WebSockets (Socket.io)**: Supported on Render; ensure the frontend uses `VITE_SOCKET_URL` with the same backend URL (https).

---

## Alternative: Manual setup (no Blueprint)

If you prefer not to use `render.yaml`:

1. **New → Web Service** for the backend:
   - Root Directory: folder that contains `package.json` and `backend/`
   - Build: `npm install`
   - Start: `node backend/server.js`
   - Add the same env vars as above.

2. **New → Static Site** for the frontend:
   - Root Directory: `frontend` (or the folder that contains frontend `package.json`)
   - Build: `npm install && npm run build`
   - Publish directory: `dist`
   - Add `VITE_API_BASE_URL` and `VITE_SOCKET_URL` with your backend URL, then redeploy.
   - Enable “Rewrite all to /index.html” for SPA.

---

## Troubleshooting

- **404 on frontend routes**: Enable the SPA rewrite to `/index.html` (step 5).
- **CORS errors**: Ensure `FRONTEND_URL` on the backend matches the frontend URL exactly (no trailing slash).
- **Socket.io not connecting**: Use `https://` for `VITE_SOCKET_URL`; ensure the backend is deployed and env vars are set.
- **Google login redirect error**: Add the Render backend callback URL in Google Cloud Console and set `GOOGLE_CALLBACK_URL` to that URL.
