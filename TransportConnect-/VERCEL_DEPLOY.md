# Vercel deploy – fix 404 NOT_FOUND

If you see **404 NOT_FOUND** after deploying:

## 1. Set Root Directory (most common cause)

In **Vercel → Project → Settings → General → Root Directory**:

- **Option A – deploy only the frontend**  
  Set to: `TransportConnect/TransportConnect-/frontend`  
  Then **Build Command**: `npm run build`  
  **Output Directory**: `dist`

- **Option B – deploy from the repo folder that contains `frontend/`**  
  Set to: `TransportConnect/TransportConnect-`  
  Then **Build Command**: `cd frontend && npm ci && npm run build`  
  **Output Directory**: `frontend/dist`

Vercel only uses the `vercel.json` that is inside this Root Directory. If Root Directory is wrong or empty, rewrites are not applied and you get 404.

## 2. Redeploy

After changing Root Directory, use **Redeploy** (with “Clear cache and redeploy” if needed).

## 3. Check build

In the **Deployments** tab, open the latest deployment and confirm:

- Build finished without errors.
- **Output Directory** shows `index.html` and an `assets/` folder.

If the build fails or the output is empty, the 404 is from a failed or wrong build, not from routing.
