# Auth0 Next.js App with Camera Detection

Modern Next.js application with Auth0 authentication, 3D background, and real-time camera detection features.

## Features

### ✨ Modern UI
- **Lightweight 3D Background**: Spline 3D scene with gradient fallback
- **Smooth Animations**: Framer Motion for fluid UI transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Auth0 Integration**: Secure authentication flow

### 📷 Camera Detection Tool
**Object Detection Mode:**
- Real-time object detection using TensorFlow.js COCO-SSD
- Bounding boxes with confidence scores
- Filterable detection (person, phone, laptop, etc.)
- FPS counter for performance monitoring

**Face Detection Mode:**
- Face bounding box and landmark detection
- Intelligent framing guidance:
  - "Move closer/back" based on face size
  - "Center your face" for positioning
  - "Perfect framing!" when optimal
- Privacy-focused: NO age, gender, emotion, or attribute inference

**Additional Features:**
- Snapshot capture with in-memory gallery
- Start/Stop controls
- Real-time performance metrics
- No server/database required

## 🚀 Local Development

### Prerequisites
- Node.js 18+ and npm
- Webcam (for camera features)
- Auth0 account (free tier works)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Auth0:**
   
   Update `.env.local` with your Auth0 credentials:
   ```env
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_SECRET=your-32-char-random-secret
   APP_BASE_URL=http://localhost:3000
   ```

   **Auth0 Application Settings:**
   - Allowed Callback URLs: `http://localhost:3000/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## 📦 Vercel Deployment

### Step 1: Prepare Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Add Environment Variables** (CRITICAL):

   | Variable | Value | Environments |
   |----------|-------|--------------|
   | `AUTH0_DOMAIN` | `your-domain.auth0.com` | Production, Preview, Development |
   | `AUTH0_CLIENT_ID` | Your client ID | Production, Preview, Development |
   | `AUTH0_CLIENT_SECRET` | Your client secret | Production, Preview, Development |
   | `AUTH0_SECRET` | 32+ char random string | Production, Preview, Development |
   | `APP_BASE_URL` | `https://your-app.vercel.app` | Production |
   | `APP_BASE_URL` | Your preview URL | Preview |
   | `APP_BASE_URL` | `http://localhost:3000` | Development |

4. Click **Deploy**

### Step 3: Update Auth0 Settings

After deployment, update your Auth0 application settings:

- **Allowed Callback URLs:**
  ```
  http://localhost:3000/auth/callback,
  https://your-app.vercel.app/auth/callback
  ```

- **Allowed Logout URLs:**
  ```
  http://localhost:3000,
  https://your-app.vercel.app
  ```

- **Allowed Web Origins:**
  ```
  http://localhost:3000,
  https://your-app.vercel.app
  ```

### Step 4: Redeploy (if needed)

If you added environment variables after initial deployment, trigger a redeploy in Vercel dashboard.

## 📋 Vercel Deployment Checklist

- [x] All environment variables added in Vercel
- [x] Auth0 application configured with production URLs
- [x] Camera permissions handled gracefully
- [x] No GPU/server dependencies (all client-side)
- [x] Dynamic imports for heavy libraries
- [x] Responsive design tested
- [x] Error boundaries in place
- [x] No .env.local committed to git

## 🎯 Environment Variables Reference

### Required for ALL Environments

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH0_DOMAIN` | Your Auth0 domain | `dev-abc123.auth0.com` |
| `AUTH0_CLIENT_ID` | Auth0 application client ID | `AbCdEf123456` |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret | `secret-key-here` |
| `AUTH0_SECRET` | Random 32+ character string | Generate with `openssl rand -hex 32` |
| `APP_BASE_URL` | Your application base URL | `http://localhost:3000` or `https://your-app.vercel.app` |

### Generating AUTH0_SECRET

**Mac/Linux:**
```bash
openssl rand -hex 32
```

**Windows (PowerShell):**
```powershell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

**Online:** Use a secure random string generator (32+ characters)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── camera/
│   │   └── page.tsx          # Camera detection page
│   ├── globals.css            # Global styles (Auth0 + new features)
│   ├── layout.tsx             # Root layout with Auth0Provider
│   └── page.tsx               # Home page (Auth0 + 3D background)
├── components/
│   ├── camera/
│   │   ├── ObjectDetection.tsx   # COCO-SSD object detection
│   │   └── FaceDetection.tsx     # MediaPipe face detection
│   ├── LoginButton.tsx        # Auth0 login (unchanged)
│   ├── LogoutButton.tsx       # Auth0 logout (unchanged)
│   ├── Profile.tsx            # User profile (unchanged)
│   ├── Navigation.tsx         # NEW: Navigation bar
│   └── SplineBackground.tsx   # NEW: 3D background
├── lib/
│   └── auth0.ts               # Auth0 client config (unchanged)
└── middleware.ts              # Auth0 middleware (unchanged)
```

## 🔧 Technology Stack

- **Framework:** Next.js 15.5.9 (App Router)
- **Auth:** Auth0 Next.js SDK v4
- **Animations:** Framer Motion
- **3D Graphics:** Spline (React)
- **ML/Vision:**
  - TensorFlow.js + COCO-SSD (object detection)
  - MediaPipe Tasks Vision (face detection)
- **Styling:** Tailwind CSS + Custom CSS
- **TypeScript:** Full type safety

## 🔒 Security & Privacy

- ✅ All detection runs **client-side** (no data sent to servers)
- ✅ Face detection **does NOT** infer personal attributes
- ✅ Camera access requires explicit user permission
- ✅ Snapshots stored in-memory only (not persisted)
- ✅ Auth0 handles authentication securely
- ✅ No cookies or tracking beyond Auth0 session

## 📱 Browser Compatibility

- ✅ Chrome 90+ (recommended)
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

**Note:** Camera features require HTTPS in production (Vercel provides this automatically)

## ⚡ Performance Optimizations

- Dynamic imports for heavy libraries (TensorFlow.js, MediaPipe)
- Detection throttled to ~10 FPS for battery efficiency
- Lightweight 3D scene with gradient fallback
- Lazy loading of Spline component
- Optimized canvas rendering

## 🐛 Troubleshooting

### Camera not working in production
- Ensure your Vercel deployment uses HTTPS (automatic)
- Check browser camera permissions

### Spline scene not loading
- Falls back to gradient orbs automatically
- Check browser console for errors

### Auth0 errors
- Verify all environment variables are set in Vercel
- Check Auth0 callback URLs match your domain exactly
- Ensure `AUTH0_SECRET` is at least 32 characters

### Build errors on Vercel
- All dependencies are compatible with Next.js 15
- No GPU or server-side dependencies required

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Auth0 for authentication
- TensorFlow.js for object detection
- MediaPipe for face detection
- Spline for 3D backgrounds
- Framer Motion for animations

---

**Built with ❤️ using Next.js and modern web technologies**
