# 🚀 Vercel Deployment Checklist

## Pre-Deployment

### Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` without errors
- [ ] Test Auth0 login/logout flow
- [ ] Test camera tool with webcam
- [ ] Test object detection mode
- [ ] Test face detection mode
- [ ] Test snapshot functionality
- [ ] Verify navigation works
- [ ] Check responsive design on mobile

### Environment Setup
- [ ] `.env.local` configured with valid Auth0 credentials
- [ ] Auth0 application created at https://manage.auth0.com
- [ ] Auth0 callbacks configured:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000` (logout)
  - `http://localhost:3000` (web origins)

## Vercel Deployment

### Repository Setup
- [ ] Git repository initialized
- [ ] All changes committed
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] `.env.local` NOT committed (check .gitignore)

### Vercel Configuration
- [ ] Vercel account created/logged in
- [ ] Repository imported to Vercel
- [ ] Framework preset: **Next.js** (auto-detected)
- [ ] Build command: `npm run build` (default)
- [ ] Output directory: `.next` (default)

### Environment Variables (CRITICAL!)
Add these in Vercel → Project Settings → Environment Variables:

**Production:**
- [ ] `AUTH0_DOMAIN` = your-domain.auth0.com
- [ ] `AUTH0_CLIENT_ID` = your-client-id
- [ ] `AUTH0_CLIENT_SECRET` = your-client-secret
- [ ] `AUTH0_SECRET` = (generate new 32+ char random string)
- [ ] `APP_BASE_URL` = https://your-app.vercel.app

**Preview:**
- [ ] Same as above, but `APP_BASE_URL` = your preview URL

**Development:**
- [ ] Same as above, but `APP_BASE_URL` = http://localhost:3000

### Initial Deploy
- [ ] Click **Deploy** button
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Check build logs for errors
- [ ] Note your deployment URL

## Post-Deployment

### Auth0 Configuration Update
Go back to Auth0 Dashboard → Your Application → Settings:

- [ ] Add production callback URL:
  ```
  https://your-app.vercel.app/auth/callback
  ```
- [ ] Add production logout URL:
  ```
  https://your-app.vercel.app
  ```
- [ ] Add production web origin:
  ```
  https://your-app.vercel.app
  ```
- [ ] Click **Save Changes**

### Verification Tests
- [ ] Visit your Vercel URL
- [ ] 3D background loads (or gradient fallback)
- [ ] Navigation bar appears
- [ ] Click "Log In" → Auth0 login page appears
- [ ] Complete login → redirected back to app
- [ ] User profile displays correctly
- [ ] Click "Camera Tool" → camera page loads
- [ ] Grant camera permissions
- [ ] Start camera → video feed appears
- [ ] Object detection works and displays bounding boxes
- [ ] Switch to face detection → face framing guidance appears
- [ ] Take snapshots → gallery updates
- [ ] Click "Log Out" → redirected to home

### Performance Check
- [ ] Lighthouse score > 80
- [ ] Time to Interactive < 5s
- [ ] Camera detection runs at ~10 FPS
- [ ] No console errors
- [ ] HTTPS enabled (automatic with Vercel)

## Troubleshooting

### Build Fails
**Check:**
- All dependencies installed (`npm install` locally first)
- No TypeScript errors (`npm run build` locally)
- Node version compatibility (18+)

### Auth0 Errors in Production
**Check:**
- All environment variables set in Vercel
- `APP_BASE_URL` matches your Vercel domain exactly
- Auth0 callback URLs include production domain
- `AUTH0_SECRET` is at least 32 characters

### Camera Not Working
**Check:**
- HTTPS enabled (Vercel auto-provides)
- Browser camera permissions granted
- No console errors about MediaPipe/TensorFlow.js
- CSP headers not blocking external resources

### 3D Background Not Loading
**Normal behavior:** Falls back to gradient orbs
**Check console** for Spline loading errors

## Optional Enhancements

### Custom Domain
- [ ] Add custom domain in Vercel settings
- [ ] Update `APP_BASE_URL` to custom domain
- [ ] Update Auth0 callback URLs to custom domain
- [ ] Wait for DNS propagation

### Analytics
- [ ] Enable Vercel Analytics
- [ ] Add Google Analytics (optional)

### Monitoring
- [ ] Set up Vercel error tracking
- [ ] Configure deployment notifications

## Environment Variable Reference

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `AUTH0_DOMAIN` | Auth0 Dashboard → Settings | `dev-abc123.auth0.com` |
| `AUTH0_CLIENT_ID` | Auth0 Dashboard → Settings | `AbCdEf123456789` |
| `AUTH0_CLIENT_SECRET` | Auth0 Dashboard → Settings | `long-secret-string` |
| `AUTH0_SECRET` | Generate yourself | `openssl rand -hex 32` |
| `APP_BASE_URL` | Your deployed URL | `https://your-app.vercel.app` |

## Generate AUTH0_SECRET

**Mac/Linux:**
```bash
openssl rand -hex 32
```

**Windows PowerShell:**
```powershell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

**Online:** https://www.random.org/strings/ (64 chars, alphanumeric)

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Auth0 Docs:** https://auth0.com/docs/quickstart/webapp/nextjs
- **Next.js Docs:** https://nextjs.org/docs

---

**Status:** Ready for deployment ✅
**Estimated Time:** 10-15 minutes
**Difficulty:** Easy 🟢
