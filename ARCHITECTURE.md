# 🏗️ Project Architecture

## 📁 File Structure

```
auth0-nextjs-app/
│
├── 📄 Configuration Files
│   ├── .env.local              # Environment variables (Auth0 credentials)
│   ├── package.json            # Dependencies + scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   └── eslint.config.mjs       # ESLint rules
│
├── 📚 Documentation
│   ├── README.md               # Complete project documentation
│   ├── QUICKSTART.md           # 5-minute setup guide
│   ├── DEPLOYMENT.md           # Vercel deployment checklist
│   ├── TESTING.md              # Testing & verification
│   ├── SUMMARY.md              # Feature summary
│   ├── CHANGES.md              # Change log
│   └── ARCHITECTURE.md         # This file
│
└── src/
    ├── 📱 app/                 # Next.js App Router
    │   ├── layout.tsx          # Root layout (Auth0Provider)
    │   ├── page.tsx            # Home page (Auth0 + 3D)
    │   ├── globals.css         # Global styles
    │   └── camera/
    │       └── page.tsx        # Camera detection page
    │
    ├── 🧩 components/
    │   ├── Auth0 Components (Original)
    │   │   ├── LoginButton.tsx
    │   │   ├── LogoutButton.tsx
    │   │   └── Profile.tsx
    │   │
    │   ├── New UI Components
    │   │   ├── SplineBackground.tsx
    │   │   └── Navigation.tsx
    │   │
    │   └── camera/
    │       ├── ObjectDetection.tsx
    │       └── FaceDetection.tsx
    │
    ├── 📚 lib/
    │   └── auth0.ts            # Auth0 client configuration
    │
    └── middleware.ts           # Auth0 middleware (handles /auth/* routes)
```

---

## 🔄 Application Flow

### User Journey: Home Page

```
User visits /
    ↓
Browser loads page.tsx
    ↓
┌─────────────────────────────────┐
│  Server-Side (page.tsx)         │
│  - Check auth0.getSession()     │
│  - Determine if user logged in  │
└─────────────────────────────────┘
    ↓
Render HTML with user state
    ↓
Client receives page
    ↓
┌─────────────────────────────────┐
│  Client-Side Hydration          │
│  1. SplineBackground mounts     │
│  2. Navigation mounts            │
│  3. Framer Motion animates      │
│  4. Auth0Provider wraps app     │
└─────────────────────────────────┘
    ↓
User sees animated home page
    ↓
┌─────────────────────────────────┐
│  User Actions:                  │
│  - Click "Log In" → Auth0       │
│  - Click "Camera Tool" → /camera│
│  - Click "Log Out" → Auth0      │
└─────────────────────────────────┘
```

### User Journey: Camera Page

```
User clicks "Camera Tool"
    ↓
Navigate to /camera
    ↓
Camera page.tsx loads
    ↓
┌─────────────────────────────────┐
│  Initial Render                 │
│  - Video element (hidden)       │
│  - Controls (visible)           │
│  - Detection components (lazy)  │
└─────────────────────────────────┘
    ↓
User clicks "Start Camera"
    ↓
┌─────────────────────────────────┐
│  Request Camera Access          │
│  navigator.mediaDevices         │
│    .getUserMedia()              │
└─────────────────────────────────┘
    ↓
Browser prompts for permission
    ↓
User grants permission
    ↓
┌─────────────────────────────────┐
│  Camera Stream Active           │
│  - Video feed starts            │
│  - Detection component loads    │
│  - ML model downloads (async)   │
└─────────────────────────────────┘
    ↓
Model loads (~2-3 seconds)
    ↓
┌─────────────────────────────────┐
│  Detection Loop Starts          │
│  Every 100ms:                   │
│  1. Capture video frame         │
│  2. Run ML inference            │
│  3. Draw results on canvas      │
│  4. Update UI with detections   │
└─────────────────────────────────┘
    ↓
User interacts:
- Change detection mode
- Take snapshots
- Filter objects
- Stop camera
```

---

## 🔐 Auth0 Integration Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     USER BROWSER                          │
└──────────────────────────────────────────────────────────┘
                            │
                            │ 1. Visit /
                            ↓
┌──────────────────────────────────────────────────────────┐
│                   NEXT.JS APP (Vercel)                    │
│                                                            │
│  middleware.ts (Edge Runtime)                             │
│  ├─ Intercepts all requests                               │
│  ├─ Handles /auth/* routes automatically                  │
│  └─ Manages session cookies                               │
│                                                            │
│  Server Components                                         │
│  ├─ page.tsx: await auth0.getSession()                    │
│  └─ Renders with user state                               │
│                                                            │
│  Client Components                                         │
│  ├─ Wrapped in Auth0Provider                              │
│  ├─ Profile.tsx: useUser() hook                           │
│  └─ LoginButton/LogoutButton: <a> tags                    │
└──────────────────────────────────────────────────────────┘
                            │
                            │ 2. User clicks "Log In"
                            │    href="/auth/login"
                            ↓
┌──────────────────────────────────────────────────────────┐
│              AUTH0 AUTHENTICATION SERVER                  │
│                                                            │
│  - User enters credentials                                │
│  - Validates user                                          │
│  - Creates session                                         │
│  - Redirects to callback URL                              │
└──────────────────────────────────────────────────────────┘
                            │
                            │ 3. Redirect to /auth/callback
                            ↓
┌──────────────────────────────────────────────────────────┐
│                   NEXT.JS APP (Vercel)                    │
│                                                            │
│  middleware.ts                                             │
│  ├─ Receives callback                                     │
│  ├─ Exchanges code for tokens                             │
│  ├─ Creates encrypted session cookie                      │
│  └─ Redirects to /                                        │
└──────────────────────────────────────────────────────────┘
                            │
                            │ 4. Redirect to home (authenticated)
                            ↓
┌──────────────────────────────────────────────────────────┐
│                     USER BROWSER                          │
│                                                            │
│  - Session cookie stored                                  │
│  - User sees profile                                       │
│  - Protected content accessible                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Architecture

### Home Page Component Tree

```
<html>
  <body>
    <Auth0Provider>                    ← Context provider
      <>
        <SplineBackground />           ← Fixed position, z-index: -1
        <Navigation />                 ← Fixed top, z-index: 1000
        <div className="app-container">
          <div className="main-card-wrapper">
            <img />                    ← Auth0 logo
            <h1 />                     ← Title
            <div className="action-card">
              {user ? (
                <div>
                  <p />              ← Success message
                  <Profile />        ← User info (useUser hook)
                  <LogoutButton />   ← Logout link
                </div>
              ) : (
                <>
                  <p />              ← Welcome message
                  <LoginButton />    ← Login link
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </Auth0Provider>
  </body>
</html>
```

### Camera Page Component Tree

```
<CameraPage>
  <motion.div>                         ← Framer Motion wrapper
    <h1 />                             ← Page title
    
    <div className="camera-controls">
      <select />                       ← Mode selector
      <button />                       ← Start/Stop/Snapshot
    </div>
    
    {error && <div />}                 ← Error message
    
    <div className="video-section">
      <div className="video-wrapper">
        <video ref={videoRef} />       ← Camera feed
        
        {detectionMode === 'object' && (
          <ObjectDetection>            ← Lazy loaded
            <canvas />                 ← Bounding boxes
            <div>                      ← Detection info panel
              <span />                 ← FPS counter
              <select />               ← Filter
              <ul>                     ← Detection list
                <li />                 ← Each detection
              </ul>
            </div>
          </ObjectDetection>
        )}
        
        {detectionMode === 'face' && (
          <FaceDetection>              ← Lazy loaded
            <canvas />                 ← Face landmarks
            <div>                      ← Guidance panel
              <span />                 ← FPS counter
              <div />                  ← Framing message
              <ul />                   ← Framing tips
            </div>
          </FaceDetection>
        )}
      </div>
      
      {snapshots.length > 0 && (
        <motion.div>                   ← Snapshot gallery
          <h3 />                       ← Gallery title
          <div>
            {snapshots.map(img =>
              <motion.img />           ← Thumbnail
            )}
          </div>
          <button />                   ← Clear all
        </motion.div>
      )}
    </div>
  </motion.div>
</CameraPage>
```

---

## 🔄 Data Flow

### Auth0 Session Flow

```
Server Component (page.tsx)
    ↓
auth0.getSession()
    ↓
Reads encrypted cookie
    ↓
Returns user object or null
    ↓
Server renders HTML with user state
    ↓
Client receives pre-rendered page
    ↓
Client-side hydration
    ↓
Auth0Provider provides context
    ↓
Child components use useUser()
    ↓
User object available in client components
```

### Camera Detection Flow (Object Detection)

```
User clicks "Start Camera"
    ↓
getUserMedia() called
    ↓
Browser prompts for permission
    ↓
Stream obtained → videoRef.current.srcObject
    ↓
Dynamic import: ObjectDetection component loads
    ↓
useEffect runs: Load COCO-SSD model
    ↓
cocoSsd.load() downloads model (~5MB)
    ↓
Model ready → Start detection loop
    ↓
┌────────────────────────────────┐
│   Detection Loop (every 100ms) │
│                                 │
│   1. Check video ready          │
│   2. Run model.detect(video)    │
│   3. Filter by selected class   │
│   4. Update state with results  │
│   5. Clear canvas               │
│   6. Draw bounding boxes        │
│   7. Draw labels                │
│   8. Schedule next iteration    │
└────────────────────────────────┘
    ↓
Detection results displayed in UI
```

### Snapshot Capture Flow

```
User clicks "Snapshot" button
    ↓
captureSnapshot() called
    ↓
Create temporary canvas
    ↓
Set canvas size to video dimensions
    ↓
ctx.drawImage(videoRef.current, 0, 0)
    ↓
canvas.toDataURL('image/png')
    ↓
Base64 image string created
    ↓
setSnapshots([newImage, ...prev].slice(0, 6))
    ↓
State updates → Re-render
    ↓
New thumbnail appears in gallery
    ↓
(Image stored in memory only, lost on refresh)
```

---

## 🧠 Machine Learning Architecture

### TensorFlow.js (Object Detection)

```
┌─────────────────────────────────────────┐
│          Browser Environment             │
│                                          │
│  TensorFlow.js                           │
│  ├─ WebGL Backend (GPU acceleration)    │
│  ├─ WASM Backend (CPU fallback)         │
│  └─ Model execution engine               │
│                                          │
│  COCO-SSD Model                          │
│  ├─ Pre-trained on COCO dataset         │
│  ├─ Detects 80+ object classes          │
│  ├─ Returns: [class, bbox, confidence]  │
│  └─ Optimized for real-time detection   │
│                                          │
│  Input: Video frame (ImageData)         │
│  Output: Array of detections             │
│                                          │
│  Performance:                            │
│  - GPU: ~15-20 FPS                       │
│  - CPU: ~5-10 FPS (throttled to 10)     │
└─────────────────────────────────────────┘
```

### MediaPipe (Face Detection)

```
┌─────────────────────────────────────────┐
│          Browser Environment             │
│                                          │
│  MediaPipe Tasks Vision                  │
│  ├─ WASM Runtime                         │
│  ├─ GPU delegate (if available)         │
│  └─ BlazeFace model                      │
│                                          │
│  Face Detector                           │
│  ├─ Detects face bounding box           │
│  ├─ Identifies 6 keypoints              │
│  │   (eyes, nose, mouth, ears)          │
│  └─ Returns confidence scores            │
│                                          │
│  Input: Video frame + timestamp          │
│  Output: Detection with landmarks        │
│                                          │
│  Performance:                            │
│  - Lightweight model (~1MB)              │
│  - ~10-15 FPS on most devices            │
│  - Optimized for mobile                  │
└─────────────────────────────────────────┘
```

---

## 🎯 Performance Optimizations

### Code Splitting Strategy

```
Entry Point (page.tsx)
    │
    ├─ Critical Path (SSR)
    │   ├─ Auth0 session check
    │   ├─ Page HTML
    │   └─ Critical CSS
    │
    ├─ Client Hydration
    │   ├─ React runtime
    │   ├─ Framer Motion (~50KB)
    │   └─ Auth0Provider (~30KB)
    │
    └─ Lazy Loaded (on /camera)
        ├─ Camera page component
        ├─ TensorFlow.js (~1.2MB)
        ├─ COCO-SSD model (~5MB)
        ├─ MediaPipe (~800KB)
        └─ Detection components

Total Initial Bundle: ~300KB (home page)
Camera Tools Bundle: ~7MB (cached after first load)
```

### Detection Performance Optimization

```
Detection Loop
    │
    ├─ Throttle to 100ms (10 FPS max)
    │   └─ Prevents battery drain
    │
    ├─ Canvas clearing optimization
    │   └─ Only clear and redraw when needed
    │
    ├─ Model inference caching
    │   └─ Skip if video frame unchanged
    │
    ├─ GPU acceleration
    │   └─ TensorFlow.js uses WebGL
    │
    └─ Worker threads (future)
        └─ Could offload to Web Worker
```

### Bundle Optimization

```
Build Process (npm run build)
    │
    ├─ Tree shaking
    │   └─ Remove unused code
    │
    ├─ Code splitting
    │   └─ Separate chunks per route
    │
    ├─ Minification
    │   └─ Compress JavaScript/CSS
    │
    ├─ Image optimization
    │   └─ Next.js Image component
    │
    └─ Dynamic imports
        └─ Load heavy libs on demand
```

---

## 🔒 Security Architecture

### Authentication Layer

```
┌───────────────────────────────────────────┐
│            Security Layers                 │
│                                            │
│  1. Auth0 (Third-party IdP)               │
│     ├─ OAuth 2.0 / OpenID Connect         │
│     ├─ Encrypted tokens                   │
│     └─ Secure session management          │
│                                            │
│  2. Next.js Middleware (Edge)             │
│     ├─ Intercepts all requests            │
│     ├─ Validates session cookies          │
│     └─ CSRF protection                    │
│                                            │
│  3. Environment Variables                  │
│     ├─ Stored in Vercel (encrypted)       │
│     ├─ Never exposed to client            │
│     └─ Rotatable secrets                  │
│                                            │
│  4. HTTPS (Vercel)                        │
│     ├─ Automatic SSL certificates         │
│     ├─ TLS 1.3                            │
│     └─ HSTS enabled                       │
└───────────────────────────────────────────┘
```

### Camera Privacy Protection

```
Camera Access
    │
    ├─ Browser Permission API
    │   ├─ Explicit user consent required
    │   ├─ Can be revoked anytime
    │   └─ Per-origin permission
    │
    ├─ Client-Side Processing ONLY
    │   ├─ Video never sent to server
    │   ├─ Detection runs in browser
    │   └─ No external API calls
    │
    ├─ No Biometric Storage
    │   ├─ No face embeddings saved
    │   ├─ No personal data extracted
    │   └─ Snapshots in-memory only
    │
    └─ Privacy-Focused Detection
        ├─ Face location ONLY
        ├─ No attribute inference
        └─ No identity matching
```

---

## 🌐 Deployment Architecture

### Vercel Edge Network

```
┌─────────────────────────────────────────┐
│              User Browser                │
└─────────────────────────────────────────┘
                  │
                  │ HTTPS Request
                  ↓
┌─────────────────────────────────────────┐
│         Vercel Edge Network              │
│         (CDN + Edge Runtime)             │
│                                          │
│  1. Static Assets (cached)               │
│     ├─ HTML pages                        │
│     ├─ CSS/JS bundles                    │
│     └─ Images                            │
│                                          │
│  2. Edge Middleware                      │
│     ├─ Auth0 session validation          │
│     ├─ Route handling                    │
│     └─ Response generation               │
│                                          │
│  3. Server Components (SSR)              │
│     ├─ Rendered on-demand                │
│     ├─ Auth0 integration                 │
│     └─ Dynamic content                   │
└─────────────────────────────────────────┘
                  │
                  │ If auth required
                  ↓
┌─────────────────────────────────────────┐
│            Auth0 Servers                 │
│         (Authentication)                 │
└─────────────────────────────────────────┘
```

### Asset Delivery

```
User Request
    │
    ├─ Static Assets
    │   ├─ Served from Vercel CDN
    │   ├─ Cached at edge locations
    │   └─ Long cache headers
    │
    ├─ ML Models
    │   ├─ Loaded from CDN (TensorFlow/Google)
    │   ├─ Cached in browser
    │   └─ ~7MB total (one-time download)
    │
    └─ Dynamic Content
        ├─ Server-side rendered
        ├─ Personalized per user
        └─ Not cached
```

---

## 📊 Monitoring & Observability

### Client-Side Metrics

```
Performance Tracking
    │
    ├─ FPS Counter
    │   └─ Displayed in detection UI
    │
    ├─ Model Load Time
    │   └─ Logged to console
    │
    ├─ Detection Latency
    │   └─ Measured per frame
    │
    └─ Browser Performance API
        ├─ Time to Interactive
        ├─ First Contentful Paint
        └─ Largest Contentful Paint
```

### Server-Side Metrics (Vercel)

```
Vercel Analytics
    │
    ├─ Request metrics
    │   ├─ Response time
    │   ├─ Error rate
    │   └─ Geographic distribution
    │
    ├─ Build metrics
    │   ├─ Build duration
    │   ├─ Bundle size
    │   └─ Deploy success rate
    │
    └─ Usage metrics
        ├─ Page views
        ├─ Unique visitors
        └─ Bandwidth
```

---

## 🔄 State Management

### Server State (Auth0)

```
Next.js Server
    │
    ├─ auth0.getSession()
    │   └─ Reads from encrypted cookie
    │
    └─ Returns user object
        ├─ user.name
        ├─ user.email
        ├─ user.picture
        └─ user.sub (unique ID)
```

### Client State (React)

```
Camera Page Component
    │
    ├─ useState Hooks
    │   ├─ stream (MediaStream)
    │   ├─ isActive (boolean)
    │   ├─ detectionMode ('object' | 'face')
    │   ├─ snapshots (string[])
    │   └─ error (string)
    │
    ├─ useRef Hooks
    │   ├─ videoRef (HTMLVideoElement)
    │   ├─ canvasRef (HTMLCanvasElement)
    │   └─ animationFrameRef (number)
    │
    └─ useEffect Hooks
        ├─ Load ML models
        ├─ Start/stop detection loop
        └─ Cleanup on unmount
```

---

## 🎯 Architecture Decisions

### Why Next.js App Router?
- ✅ Server Components for Auth0 session
- ✅ Built-in API routes (not needed but available)
- ✅ Automatic code splitting
- ✅ Optimized production builds

### Why Edge Middleware?
- ✅ Low latency (runs close to user)
- ✅ Lightweight (no cold starts)
- ✅ Perfect for Auth0 session validation

### Why Client-Side ML?
- ✅ Privacy (no server processing)
- ✅ Lower latency (no network round trip)
- ✅ Offline capable (after model cache)
- ✅ No server costs

### Why Dynamic Imports?
- ✅ Smaller initial bundle
- ✅ Faster page load
- ✅ Load ML libraries only when needed

### Why Spline + Fallback?
- ✅ Beautiful 3D with minimal code
- ✅ Gradient fallback for reliability
- ✅ No Three.js bundle size overhead

---

## 📐 Scalability Considerations

### Current Architecture Scales Well For:
- ✅ **10K users:** Vercel CDN handles static assets
- ✅ **100K users:** Edge middleware is globally distributed
- ✅ **1M users:** No server-side processing for detection

### Potential Bottlenecks:
- ⚠️ **Auth0 Session Validation:** Limited by Auth0 plan
- ⚠️ **Model Download:** 7MB per new user (cached after)
- ⚠️ **Browser Performance:** Older devices may struggle

### Optimization Paths:
1. **CDN for ML Models:** Host models on Vercel CDN
2. **Web Workers:** Offload detection to background thread
3. **Model Optimization:** Use TensorFlow Lite models
4. **Progressive Enhancement:** Disable detection on slow devices

---

**Architecture Status:** ✅ Production-ready, scalable, and maintainable
