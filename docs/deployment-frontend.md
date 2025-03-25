
# LeadGreen Frontend Deployment Guide

This guide will walk you through deploying the LeadGreen frontend (Vite React application) on either Vercel or Render.

## Prerequisites

- Git
- Node.js and npm
- A GitHub repository with the frontend code
- A Vercel or Render account
- Your backend already deployed and running

## Table of Contents

1. [Environment Configuration](#1-environment-configuration)
2. [Deployment Options](#2-deployment-options)
   - [Option A: Deploying on Vercel](#option-a-deploying-on-vercel)
   - [Option B: Deploying on Render](#option-b-deploying-on-render)
3. [Post-Deployment Steps](#3-post-deployment-steps)
4. [Troubleshooting](#4-troubleshooting)

## 1. Environment Configuration

Before deployment, you need to properly configure environment variables to connect your frontend to your backend API.

### Setting Up Environment Variables

Your frontend needs to know the URL of your backend API. Create a `.env` file in your project root with the following:

```
VITE_BACKEND=https://your-backend-url.com
```

Replace `https://your-backend-url.com` with the actual URL of your deployed backend (see the [backend](docs/deploymend-backend.md) guide for information).

> **Important**: In Vite, all environment variables must be prefixed with `VITE_` to be accessible in your client-side code.

## 2. Deployment Options

### Option A: Deploying on Vercel

Vercel is optimized for frontend applications and offers a straightforward deployment process.

1. **Push Your Code to GitHub**:
   Ensure your code is in a GitHub repository.

2. **Sign Up/Log In to Vercel**:
   - Go to [Vercel](https://vercel.com/) and sign up or log in
   - Connect your GitHub account

3. **Import Your Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will automatically detect that it's a Vite project

4. **Configure Project**:
   - Project Name: `leadgreen-frontend` (or your preferred name)
   - Framework Preset: Vite
   - Build and Output Settings: Leave as default
   - Root Directory: `frontend/` (The directory where package.json is located)

5. **Environment Variables**:
   - Click "Environment Variables" to expand the section
   - Add a variable with:
     - Name: `VITE_BACKEND`
     - Value: Your backend URL (e.g., `https://leadgreen-backend.onrender.com`)
   - Select all environments (Production, Preview, and Development)

6. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

7. **Access Your Deployed Site**:
   - Once deployment is complete, Vercel will provide a URL (e.g., `https://leadgreen.vercel.app`)
   - You can also configure a custom domain in the Vercel dashboard

### Option B: Deploying on Render

If you deployed your backend on Render, you might prefer to keep all services on the same platform.

1. **Push Your Code to GitHub**:
   Ensure your code is in a GitHub repository.

2. **Sign Up/Log In to Render**:
   - Go to [Render](https://render.com/) and sign up or log in
   - Connect your GitHub account

3. **Create a New Static Site**:
   - From your dashboard, click "New" → "Static Site"
   - Select your repository

4. **Configure Your Site**:
   - Name: `leadgreen-frontend` (or your preferred name)
   - Root Directory: Leave empty if your package.json is in the root
   - Build Command: `npm run build`
   - Publish Directory: `dist` (this is Vite's default output directory)

5. **Environment Variables**:
   - Scroll down to "Environment Variables"
   - Add a variable:
     - Key: `VITE_BACKEND`
     - Value: Your backend URL (e.g., `https://leadgreen-backend.onrender.com`)

6. **Deploy**:
   - Click "Create Static Site"
   - Render will build and deploy your application

7. **Access Your Deployed Site**:
   - Once deployment is complete, Render will provide a URL
   - You can configure a custom domain in the Render dashboard

## 3. Post-Deployment Steps

### Verify Connectivity

1. **Test Backend Connection**:
   - Navigate to your deployed frontend
   - Try features that require backend connectivity (login, fetching data, etc.)
   - Check browser console for API-related errors

2. **Update CORS Settings if Needed**:
   If you encounter CORS errors, update your backend CORS settings to allow requests from your new frontend domain.

### Set Up Custom Domain (Optional)

Both Vercel and Render provide easy ways to set up a custom domain:

- **On Vercel**: Dashboard → Your Project → Settings → Domains
- **On Render**: Dashboard → Your Site → Settings → Custom Domain

## 4. Troubleshooting

### Environment Variables Not Loading

- Ensure all environment variables are prefixed with `VITE_`
- Rebuild your application after changing environment variables
- Verify environment variables are correctly set in your hosting platform

### API Connection Issues

- Check that your backend URL is correct (including protocol - http/https)
- Verify that your backend is running
- Check CORS configuration on your backend
- Look for network errors in the browser console

### Build Failures

- Verify your package.json scripts:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```
- Check build logs in your hosting platform for specific errors
- Test building locally with `npm run build` to identify issues

### Performance Optimization

- Enable caching headers for static assets
- Set up a CDN if serving users globally
- Implement code splitting for larger applications

---

Remember that your frontend's performance and reliability are highly dependent on your backend. Make sure both services are properly configured to work together.

If you need to make changes to your application after deployment, simply push your changes to GitHub, and both Vercel and Render can automatically rebuild and deploy your updated application.
