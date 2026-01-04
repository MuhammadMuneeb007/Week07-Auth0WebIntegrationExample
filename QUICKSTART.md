# ⚡ Quick Start Guide

## 🏃 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Configure Auth0 (2 min)

**Option A: Already have Auth0 account?**

Update `.env.local`:
```env
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=your-32-char-secret
APP_BASE_URL=http://localhost:3000
```

**Option B: Need Auth0 account?**

1. Go to https://auth0.com (free tier available)
2. Create account
3. Create "Regular Web Application"
4. In Settings, set:
   - Allowed Callback URLs: `http://localhost:3000/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
5. Copy Domain, Client ID, Client Secret to `.env.local`

### Step 3: Run the App (1 min)
```bash
npm run dev
```

Open http://localhost:3000

### Step 4: Test Features (1 min)

**Home Page:**
- ✅ See animated 3D background
- ✅ Click "Log In" to test Auth0

**Camera Tool:**
- ✅ Visit http://localhost:3000/camera
- ✅ Click "Start Camera" and allow permissions
- ✅ Try object detection mode
- ✅ Switch to face detection mode
- ✅ Take some snapshots

## 🎉 Done!

You now have a fully functional app with:
- 🔐 Auth0 authentication
- 🎨 3D animated background  
- 📷 AI-powered camera detection
- 📸 Snapshot capture

## 🚀 Deploy to Production

Ready to go live? Follow these steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy to Vercel:**
   - Visit https://vercel.com/new
   - Import your repository
   - Add environment variables (same as .env.local)
   - Click Deploy

3. **Update Auth0:**
   - Add production URLs to Auth0 settings
   - Example: `https://your-app.vercel.app/auth/callback`

📖 **Full deployment guide:** See `DEPLOYMENT.md`

## 🆘 Troubleshooting

### "Auth0 error"
- Check your `.env.local` has correct credentials
- Verify Auth0 callback URLs are correct

### "Camera not working"
- Allow camera permissions in browser
- Check you're using HTTPS (or localhost)

### "Build error"
- Run `npm install` again
- Check Node version (18+ required)

### "3D background not loading"
- Normal - gradient fallback displays automatically
- Check browser console for errors

## 📚 Need More Help?

- **Full docs:** `README.md`
- **Deployment guide:** `DEPLOYMENT.md`
- **Feature summary:** `SUMMARY.md`

---

**Happy coding! 🎉**
