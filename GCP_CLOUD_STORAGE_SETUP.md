# GCP Cloud Storage Setup Guide

## Overview
Your backend is now configured to use **GCP Cloud Storage (bucket: shivam-18968)** for file uploads.

## Prerequisites
✅ GCP Bucket: `shivam-18968` (must exist)
✅ Firebase credentials: `firebase-service-account.json`
✅ Backend deployed to Cloud Run

## Setup Steps

### Step 1: Add Firebase Credentials
1. Go to [GCP Console](https://console.cloud.google.com/)
2. Select project: `college-event-system-b712f`
3. Navigate: **Service Accounts** → Click your service account
4. Click **Keys** → **Create Key** → **JSON**
5. Save as `backend/firebase-service-account.json`

**DO NOT commit this file to GitHub!** It's already in `.gitignore`

### Step 2: Verify Bucket Permissions
The service account must have permissions for bucket `shivam-18968`:

1. Go to [GCP Console](https://console.cloud.google.com/) → **Cloud Storage** → `shivam-18968`
2. Click **Permissions** tab
3. Ensure service account has role: `Storage Object Creator` and `Storage Object Viewer`

Or use gcloud:
```bash
gsutil iam ch serviceAccount:YOUR_SERVICE_ACCOUNT@college-event-system-b712f.iam.gserviceaccount.com:roles/storage.objectCreator gs://shivam-18968
gsutil iam ch serviceAccount:YOUR_SERVICE_ACCOUNT@college-event-system-b712f.iam.gserviceaccount.com:roles/storage.objectViewer gs://shivam-18968
```

### Step 3: Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add these for **Production, Preview, Development**:
   - `GCP_BUCKET_NAME` = `shivam-18968`
   - `GCP_PROJECT_ID` = `college-event-system-b712f`

### Step 4: Redeploy Backend to Cloud Run

**Option A: Using gcloud CLI**
```bash
cd backend
gcloud run deploy college-event-backend ^
  --source . ^
  --region asia-south1 ^
  --allow-unauthenticated ^
  --set-env-vars GCP_BUCKET_NAME=shivam-18968,GCP_PROJECT_ID=college-event-system-b712f
```

**Option B: Using Cloud Console**
1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click `college-event-backend` service
3. Click **Edit & Deploy New Revision**
4. Set environment variables:
   - `GCP_BUCKET_NAME=shivam-18968`
   - `GCP_PROJECT_ID=college-event-system-b712f`
5. Deploy

### Step 5: Test the Integration

**Test 1: Health Check**
```bash
curl https://backend-869254969221.asia-south1.run.app/health
# Expected: {"status": "Backend is running!", "timestamp": "..."}
```

**Test 2: File Upload**
```bash
# Create a test file
echo "test data" > test.txt

# Upload to backend
curl -X POST -F "file=@test.txt" https://backend-869254969221.asia-south1.run.app/upload

# Expected response:
# {
#   "success": true,
#   "url": "https://storage.googleapis.com/shivam-18968/uploads/...",
#   "filename": "uploads/...",
#   "size": 10,
#   "mimetype": "text/plain",
#   "message": "File uploaded successfully to GCP Cloud Storage"
# }
```

**Test 3: Access Uploaded File**
Copy the URL from the upload response and open in browser - file should be downloadable.

## Backend Files Updated

### `backend/server.js`
- Added GCP Cloud Storage integration
- Added `/upload` endpoint for file uploads
- Configured multer for file handling

### `backend/package.json`
- Added: `@google-cloud/storage` - GCP client library
- Added: `multer` - Express file upload middleware

### `backend/.env`
```
GCP_PROJECT_ID=college-event-system-b712f
GCP_BUCKET_NAME=shivam-18968
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
PORT=8080
NODE_ENV=development
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **403 Forbidden** | Service account lacks bucket permissions (see Step 2) |
| **Bucket not found** | Verify bucket name is `shivam-18968` and exists |
| **File not accessible** | Check bucket public access settings |
| **Upload timeout** | Check Cloud Run memory allocation (should be ≥512MB) |
| **CORS error** | Ensure frontend CORS is allowed in Cloud Run |

## Frontend Usage

Your `App.tsx` already has upload functionality that calls `/upload` endpoint:
```tsx
const res = await fetch(`${BACKEND_URL}/upload`, {
  method: "POST",
  body: formData,
});

const data = await res.json();
setUploadedUrl(data.url); // Public URL to uploaded file
```

## Next Steps

1. ✅ Add `firebase-service-account.json` to backend folder
2. ✅ Update vercel environment variables
3. ✅ Redeploy backend to Cloud Run
4. ✅ Test the `/upload` endpoint
5. Deploy frontend to Vercel

**Your setup is now complete!** Files uploaded from your frontend will be stored in the `shivam-18968` GCP bucket.
