# HaritsattvaFresh - Netlify Deployment Guide

## Fixed Issues

### Build Errors Resolved
- **Issue**: tRPC errors during Netlify build from cached `.netlify/plugins` directory
- **Fix**: Cleared `.netlify` directory cache and updated configuration
- **Fix**: Corrected `publish` directory from `dist` to `dist/public` in netlify.toml
- **Result**: Build now succeeds locally (verified)

## Deployment Options

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Login to Netlify**
   ```bash
   netlify login
   ```

2. **Initialize Netlify Site** (Choose one)

   **Create New Site:**
   ```bash
   netlify init
   ```

   **Or Link to Existing Site:**
   ```bash
   netlify link
   ```

3. **Deploy to Production**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Git Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings** (Auto-detected from netlify.toml)
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `.netlify/functions`

4. **Set Environment Variables** (see below)

5. **Deploy**
   - Click "Deploy site"

### Option 3: Manual Deploy (Quick Test)

```bash
# Build the project
npm run build

# Deploy manually
netlify deploy --dir=dist/public --functions=.netlify/functions --prod
```

## Required Environment Variables

Configure these in Netlify Dashboard → Site Settings → Environment Variables:

### Essential Variables
```env
NODE_ENV=production
SESSION_SECRET=<generate-with-openssl-rand-hex-32>
```

### Database (If using PostgreSQL)
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Cloudinary (For Image Uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Generate Session Secret
```bash
# On Windows (Git Bash)
openssl rand -hex 32

# Or use online generator: https://randomkeygen.com/
```

## Post-Deployment Checklist

### 1. Verify Build Output
- [ ] Check Netlify build logs for errors
- [ ] Ensure frontend assets are in `dist/public`
- [ ] Ensure serverless function is in `.netlify/functions/api.js`

### 2. Test Functionality
- [ ] Homepage loads correctly
- [ ] API endpoints respond (test `/api/products`)
- [ ] Admin panel accessible
- [ ] Image uploads work (requires Cloudinary)
- [ ] Authentication works
- [ ] Database connections work (if using PostgreSQL)

### 3. Configure Admin Access
Edit `server/adminAuth.ts` and add admin emails:
```typescript
export const ADMIN_EMAILS = [
  "admin@haritsattva.com",
  "your-email@example.com",
];
```
Then redeploy.

### 4. Set Up Database (Production)
If using PostgreSQL (recommended for production):

1. **Create Neon Database** (Free Tier Available)
   - Go to https://neon.tech
   - Create new project
   - Copy connection string

2. **Add to Netlify**
   - Add `DATABASE_URL` environment variable
   - Redeploy

3. **Run Migrations**
   ```bash
   npm run db:push
   ```

## Troubleshooting

### Build Fails with tRPC Errors
**Solution**: The `.netlify` cache was corrupted. This has been fixed:
```bash
# If you see tRPC errors again, run:
rm -rf .netlify
npm run build
```

### 404 on Routes
**Issue**: SPA routing not working
**Solution**: Already configured in netlify.toml:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### API Endpoints Not Working
**Check**:
1. Environment variables are set correctly
2. Function deployed to `.netlify/functions/api.js`
3. Redirects configured: `/api/*` → `/.netlify/functions/api/:splat`

### Images Not Uploading
**Issue**: Serverless functions can't write to filesystem
**Solution**: Use Cloudinary for image storage (already integrated)
1. Sign up at https://cloudinary.com
2. Add credentials to environment variables
3. Redeploy

### Large Bundle Size Warning
**Warning**: `index-Ct1cEGEa.js` is 814 KB
**Impact**: May affect load times
**Future Optimization**:
- Implement code splitting with `React.lazy()`
- Use dynamic imports for admin routes
- Enable tree-shaking optimizations

## Deployment Status

- [x] Build configuration fixed
- [x] Local build succeeds
- [x] Netlify configuration updated
- [ ] Deploy to Netlify
- [ ] Configure environment variables
- [ ] Test production deployment
- [ ] Set up database (if needed)
- [ ] Configure Cloudinary (if needed)

## Next Steps

1. **Deploy Now**
   ```bash
   netlify deploy --prod
   ```

2. **Monitor Deployment**
   - Watch build logs for errors
   - Check Functions tab for serverless function

3. **Test Live Site**
   - Visit your Netlify URL
   - Test all features
   - Check browser console for errors

4. **Configure Domain** (Optional)
   - Go to Site Settings → Domain management
   - Add custom domain or use Netlify subdomain

## Support

If you encounter issues:
1. Check Netlify build logs
2. Review Function logs in Netlify dashboard
3. Verify all environment variables are set
4. Ensure database is accessible from Netlify servers

## URLs

After deployment, you'll receive:
- **Site URL**: `https://your-site-name.netlify.app`
- **Admin Panel**: `https://your-site-name.netlify.app/admin`
- **API Endpoint**: `https://your-site-name.netlify.app/api/*`

---

**Last Updated**: 2025-11-20
**Status**: Ready for deployment
