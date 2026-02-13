# Vercel Deployment Guide - College Events App

## Overview
Deploy your College Events application to Vercel with GCP Cloud Run backend integration.

## Prerequisites
- Vercel account ([https://vercel.com](https://vercel.com))
- GitHub repository with your code
- GCP Cloud Run backend URL: `https://backend-869254969221.asia-south1.run.app`

## Setup Steps

### 1. **Add to Git & Push to GitHub**
```bash
git add .
git commit -m "Setup Vercel deployment with environment variables"
git push origin main
```

### 2. **Deploy on Vercel**

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. **Add Environment Variables**

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add the following:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://backend-869254969221.asia-south1.run.app`
   - **Environments**: Select `Production`, `Preview`, and `Development`
3. Click **Save**

### 4. **Deploy**
```bash
vercel --prod
```

Or use the Vercel Dashboard → **Deployments** → **Redeploy**

## Verify Deployment

### 1. **Check Build Logs**
- Go to Vercel Dashboard → Your Project → **Deployments**
- Click the latest deployment
- Check "Logs" tab for any build errors

### 2. **Test API Connection**
Open browser console and run:
```javascript
fetch('https://backend-869254969221.asia-south1.run.app/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### 3. **Check CORS Configuration**
If file upload fails, ensure your GCP backend allows requests from your Vercel domain:
```
https://your-app.vercel.app
```

## Environment Variables Reference

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://backend-869254969221.asia-south1.run.app` | Production, Preview, Development |

## File Changes Made

### `.env.local` (Development)
```
VITE_API_URL=https://backend-869254969221.asia-south1.run.app
```

### `.env.production` (Production/Vercel)
```
VITE_API_URL=https://backend-869254969221.asia-south1.run.app
```

### `vercel.json` (Vercel Configuration)
Configures build and output settings for Vercel.

### `App.tsx` (Updated)
Changed from hardcoded URL to environment variable:
```tsx
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://backend-869254969221.asia-south1.run.app";
```

## Troubleshooting

### Build Fails
- Check `package.json` has all dependencies
- Run `npm install` locally first
- Check Node.js version compatibility

### API Connection Fails
- Verify `VITE_API_URL` environment variable is set
- Check GCP backend is running
- Verify CORS headers in backend

### File Upload Fails
- Ensure Vercel domain is in GCP backend CORS whitelist
- Check backend logs: `gcloud logging read "resource.labels.service_name=your-backend-service" --limit 50 --format json`

## Next Steps
1. Monitor your Vercel deployments
2. Set up automatic deployments on git push
3. Configure custom domain (optional)
4. Set up monitoring and error tracking

## Useful Links
- Vercel Docs: https://vercel.com/docs
- Vite Env Docs: https://vitejs.dev/guide/env-and-mode.html
- GCP Cloud Run: https://cloud.google.com/run/docs
