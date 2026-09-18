# ShelfShare 📚

> A modern peer-to-peer campus book exchange platform enabling students to share textbooks, study materials, and knowledge sustainably.

---

## 🏛️ Architecture Overview

ShelfShare is architected as a decoupled full-stack application designed for cloud scalability and mobile accessibility:

```
                          ┌───────────────────────────┐
                          │   ShelfShare Ecosystem    │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
       ┌───────────────────┐                         ┌───────────────────┐
       │   Web Application │                         │  Mobile App (PWA  │
       │     (Vite/React)  │                         │    / Capacitor)   │
       └─────────┬─────────┘                         └─────────┬─────────┘
                 │                                             │
                 ▼                                             ▼
           Hosted on VERCEL                               Installable PWA
                 │                                      / Android wrapper
                 └──────────────────────┬──────────────────────┘
                                        │
                                        ▼ (REST API / HTTPS)
                            ┌───────────────────────┐
                            │    Backend API Node   │
                            │       (Express)       │
                            └───────────┬───────────┘
                                        │
                                        ▼ Hosted on RENDER
                            ┌───────────────────────┐
                            │   Cloud MySQL Database│
                            │  (TiDB / Aiven / etc) │
                            └───────────────────────┘
```

- **Frontend**: React 19, Vite, React Router 7, Axios, Vanilla CSS design system. Deployed to **Vercel**.
- **Backend**: Node.js, Express 5, MySQL2 (Connection Pool), bcrypt, CORS. Deployed to **Render**.
- **Database**: MySQL schema (`shelfshare` database with `users`, `books`, `exchange_requests`).
- **Mobile**: Progressive Web App (PWA) with offline handling and Service Worker; pre-configured with **Capacitor** for Android APK packaging.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MySQL Server (running locally or cloud MySQL connection string)
- npm

### 1. Clone & Install Dependencies

```bash
# In the root repository
npm install

# Install client dependencies
npm --prefix client install

# Install server dependencies
npm --prefix server install
```

### 2. Database Setup

1. Start your local MySQL server.
2. Create the database and tables using the provided schema:
   ```bash
   mysql -u root -p < server/config/schema.sql
   ```

### 3. Configure Environment Variables

**Backend (`server/.env`):**
Create `server/.env` (see `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=shelfshare
DB_SSL=false
```

**Frontend (`client/.env`):**
Create `client/.env` (see `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Locally

From the root directory, run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🚀 Cloud Deployment Guide

### A. Deploy Backend to Render

1. Create a free account at [render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing ShelfShare.
4. Fill in the service configuration:
   - **Name**: `shelfshare-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
5. Under **Environment Variables**, add:
   | Key | Value / Description |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` (or Render default) |
   | `CORS_ORIGIN` | `https://your-shelfshare.vercel.app` (your deployed Vercel URL) |
   | `DATABASE_URL` | Your cloud MySQL connection string (e.g. from TiDB/Aiven/Railway) |
   | *or individual DB vars:* | `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL=true` |
6. Deploy the service. Note down your backend URL (e.g. `https://shelfshare-backend.onrender.com`).
7. Verify health: `https://shelfshare-backend.onrender.com/health` should return `{"status":"ok"}`.

---

### B. Deploy Frontend to Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `client`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://shelfshare-backend.onrender.com/api` (your Render URL + `/api`) |
6. Click **Deploy**.
7. Once deployed, copy your production Vercel URL (e.g. `https://shelfshare-xxx.vercel.app`) and update the `CORS_ORIGIN` environment variable on your Render backend service.

---

### C. Cloud Database Setup

For production, you can use any cloud MySQL provider such as:
- [TiDB Cloud](https://tidbcloud.com) (Free serverless tier, MySQL compatible)
- [Aiven](https://aiven.io)
- [Railway](https://railway.app)
- [Clever Cloud](https://www.clever-cloud.com)

1. Create a MySQL database instance.
2. Run the DDL from `server/config/schema.sql` on your database instance:
   - Tables: `users`, `books`, `exchange_requests`.
3. Obtain the connection URI (e.g. `mysql://user:pass@host:3306/shelfshare?ssl={"rejectUnauthorized":true}`) and set it as `DATABASE_URL` in your Render Web Service.

---

## 📱 PWA (Progressive Web App) Installation

ShelfShare is fully configured as a Progressive Web App (PWA) with offline resilience and standalone display mode.

### On Android (Chrome):
1. Navigate to the deployed ShelfShare URL on Chrome for Android.
2. Tap the banner or open the three-dot menu `⋮`.
3. Select **"Install app"** or **"Add to Home screen"**.
4. ShelfShare will install to your app drawer with native-like fullscreen display and standalone navigation.

### On iPhone / iPad (Safari):
1. Navigate to the deployed ShelfShare URL in Safari.
2. Tap the **Share** button (box with an upward arrow at the bottom of the screen).
3. Scroll down and select **"Add to Home Screen"**.
4. Tap **Add**. The ShelfShare icon will appear on your home screen.

---

## 🤖 Android Native App Packaging (Capacitor)

The repository includes pre-configured Capacitor support for wrapping the web app into an Android project (`.apk` / `.aab`).

### Prerequisites
- [Android Studio](https://developer.android.com/studio) installed with Android SDK.
- Java JDK 17+.

### Building the Android App:

```bash
# 1. Build the production client web assets
npm --prefix client run build

# 2. Add Android platform (one-time command)
cd client
npx cap add android

# 3. Sync web assets with the Android project
npm run cap:sync

# 4. Open in Android Studio
npm run cap:open:android
```

From Android Studio:
1. Wait for Gradle to finish indexing.
2. Connect your Android device or start an emulator.
3. Click **Run ▶** to install and run the app, or go to **Build -> Generate Signed Bundle / APK** to create an installable `.apk` or Google Play `.aab`.

---

## 🔒 Security Best Practices

- **Never commit `.env` files**: All secrets and credentials must remain in deployment environment configurations.
- **Connection Pool**: Resilient against cloud database timeouts and connection drops.
- **Strict CORS**: In production, requests are limited to your configured frontend domains.
- **Input Sanitization**: MySQL queries use parameterized prepared statements (`?` placeholders) across all controllers to prevent SQL injection.
- **Password Protection**: Passwords are encrypted with `bcrypt` (salt rounds: 10) before storage.

---

## 🧪 Testing & Verification Commands

```bash
# Build the frontend production bundle
npm --prefix client run build

# Lint the frontend code
npm --prefix client run lint

# Check server health locally (when server is running)
curl http://localhost:5000/health
```
