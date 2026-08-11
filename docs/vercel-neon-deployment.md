# Vercel + Neon Deployment

This project deploys cleanly as two Vercel projects:

- `backend/` as the Express API
- `web/` as the Vite React frontend

The mobile Expo app is not deployed to Vercel.

## 1. Create The Neon Database

Use the Neon Postgres integration from the Vercel Marketplace, or create a Neon
project directly in Neon.

Use the pooled Neon connection string for the backend:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DB?sslmode=require
```

Do not put this value in the web app. It is a backend secret.

## 2. Deploy The Backend

Create a Vercel project with:

- Root Directory: `backend`
- Framework Preset: Other
- Install Command: `npm install`
- Build Command: leave empty

Set these Vercel environment variables on the backend project:

```env
DATABASE_URL=your_neon_pooled_connection_string
JWT_SECRET=use_a_long_random_secret
PG_POOL_MAX=1
DB_CREATE_DATABASE=false
ENABLE_LOCAL_UPLOADS=false
```

`PG_SSL` is optional for Neon if your `DATABASE_URL` includes
`sslmode=require`; the backend auto-detects it.

After deploy, open:

```text
https://your-backend-project.vercel.app/api/health
```

The first API request that reads data creates the tables and imports the seed
catalog/admin/customer data when the database is empty.

## 3. Deploy The Web App

Create a second Vercel project with:

- Root Directory: `web`
- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Set this Vercel environment variable on the web project:

```env
VITE_API_BASE_URL=https://your-backend-project.vercel.app/api
```

Redeploy the web app after changing `VITE_API_BASE_URL`, because Vite embeds
that value at build time.

## 4. Product Images

Existing catalog images in `web/public/images` deploy with the web app and keep
working.

Local filesystem uploads are not persistent on Vercel serverless functions. In
production, add products using externally hosted image URLs, or add a persistent
storage provider such as Vercel Blob before enabling uploads.
