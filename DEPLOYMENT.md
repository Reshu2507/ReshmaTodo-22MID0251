# Deployment Guide - ReshmaTodo-22MID0251

This document provides step-by-step instructions to upload the project to GitHub and deploy both the frontend and backend services to production hosting providers.

---

## 1. Deploy Backend on Render

Render is a unified platform to host your backend web services.

1. Create a free account on [Render](https://render.com).
2. Go to the Render Dashboard and click **New** -> **Web Service**.
3. Connect your GitHub repository to Render.
4. Set the following options:
   - **Name:** `reshmatodo-backend` (or your preferred name)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service**.
6. Once deployed, Render will provide a live API URL (e.g., `https://reshmatodo-backend.onrender.com`). Save this URL as we will need it for the frontend configuration.

---

## 2. Deploy Frontend on Vercel

Vercel is optimized for frontend hosting and works perfectly with Vite + React applications.

1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** on the Vercel Dashboard.
3. Import your GitHub repository containing the project.
4. Configure the Project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

---

## 3. Configure Environment Variables

For the application to communicate in production, environment variables must be defined on both hosting platforms.

### A. Backend Environment Variables (on Render)
Go to your Render Web Service dashboard, navigate to the **Environment** tab, and add:
- `PORT`: `5000` (Render will automatically bind to the default port, but setting it explicitly is good practice).
- `NODE_ENV`: `production`

### B. Frontend Environment Variables (on Vercel)
Go to your Vercel project dashboard, navigate to **Settings** -> **Environment Variables**, and add:
- **Key:** `VITE_API_URL`
- **Value:** `https://your-backend-render-url.onrender.com/api` (Use the Render URL you saved from Step 1, ensuring it ends with `/api`).

---

## 4. Update Frontend Environment Variable after Backend Deployment

Since the backend API URL is generated only after Render deploys the service, you must link it back to the frontend:

1. Copy the active backend URL from your Render dashboard (e.g., `https://reshmatodo-backend.onrender.com`).
2. Open your Vercel Project settings, go to the **Environment Variables** tab.
3. Update the value of the `VITE_API_URL` environment variable to:
   ```
   https://reshmatodo-backend.onrender.com/api
   ```
4. Save the changes.

---

## 5. Redeploy Frontend

To apply the updated environment variable on the live site, you must trigger a redeployment on Vercel:

1. In the Vercel dashboard, navigate to the **Deployments** tab.
2. Select your latest deployment, click the three dots (`...`), and select **Redeploy**.
3. Vercel will rebuild your Vite React application with the correct production API endpoint injected.
4. Once completed, your application is fully live and operational!
