# Deploying to GitHub Pages (Free)

This guide will help you deploy your app to GitHub Pages for free hosting.

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository
3. Your Supabase project URL and anon key (for the Edge Functions)

## Step-by-Step Instructions

### 1. Push Your Code to GitHub

If you haven't already, create a repository on GitHub and push your code:

```bash
# Initialize git if needed
git init

# Add your files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2. Set Up GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
5. Save the settings

### 3. Configure Repository Secrets

You need to add your Supabase credentials as secrets so the build process can use them:

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:
   - **Name**: `VITE_SUPABASE_URL`
     **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
     **Value**: Your Supabase anon/public key

### 4. Base Path Configuration

The workflow automatically sets the base path based on your repository name. If your repository is named `username.github.io` (a user/organization page), you'll need to manually update the workflow:

1. Open `.github/workflows/deploy.yml`
2. Find the `VITE_BASE_PATH` line in the Build step
3. Change it from `/${{ github.event.repository.name }}/` to `/`

For regular project repositories, the base path is automatically set correctly.

### 5. Trigger Deployment

After pushing your code and setting up secrets:

1. Go to the **Actions** tab in your repository
2. You should see the workflow running (or it may have already completed)
3. Once it completes successfully, your site will be live!

### 6. Access Your Site

Your site will be available at:
- `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Or if it's a user/organization page:
- `https://YOUR_USERNAME.github.io/`

## Troubleshooting

### Build Fails

- Check the **Actions** tab for error messages
- Ensure all secrets are set correctly
- Verify your repository name matches the base path in the workflow

### Site Shows 404 or Blank Page

- Check that `VITE_BASE_PATH` matches your repository name
- Ensure all assets are loading (check browser console)
- Verify the build completed successfully

### Environment Variables Not Working

- Make sure secrets are set in **Settings** → **Secrets and variables** → **Actions**
- Secrets must be named exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- After adding secrets, trigger a new deployment by pushing a commit

## Alternative: Vercel (Even Easier!)

If you want an even simpler deployment option, consider **Vercel**:

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project**
3. Import your GitHub repository
4. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Click **Deploy**

Vercel automatically:
- Detects Vite projects
- Builds and deploys on every push
- Provides a custom domain
- Handles routing automatically

Your site will be live at: `https://YOUR_PROJECT_NAME.vercel.app`

## Updating Your Site

Every time you push changes to the `main` branch, GitHub Actions will automatically rebuild and redeploy your site. Just push your changes and wait a few minutes!

