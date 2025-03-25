
# LeadGreen Backend Deployment Guide

This document provides detailed instructions for deploying the LeadGreen backend to a production environment. Follow these steps to set up your infrastructure, database, and application.

## Prerequisites

- Git
- Python 3.x
- A Render.com account
- An AWS account (or alternative cloud storage provider)
- Basic familiarity with command line interfaces

## Table of Contents

1. [Setting Up Cloud Storage for Images](#1-setting-up-cloud-storage-for-images)
2. [Database Setup](#2-database-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Deploying the Backend to Render](#4-deploying-the-backend-to-render)
5. [Connecting Services](#5-connecting-services)
6. [Post-Deployment Verification](#6-post-deployment-verification)
7. [Troubleshooting](#7-troubleshooting)

## 1. Setting Up Cloud Storage for Images

### Option A: AWS S3 (Recommended)

1. **Create an AWS Account**:
   - Visit [AWS](https://aws.amazon.com/) and sign up if you don't have an account.

2. **Create an S3 Bucket**:
   - Go to the S3 console and click "Create bucket"
   - Choose a unique name and select your preferred region
   - Configure the bucket for public access (for serving images)
   - Click "Create bucket"

3. **Configure CORS**:
   - Select your bucket and go to the "Permissions" tab
   - Find the CORS configuration section and add:
     ```json
     [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "PUT", "POST"],
         "AllowedOrigins": ["*"],
         "ExposeHeaders": []
       }
     ]
     ```

4. **Create IAM User**:
   - Go to IAM console and create a new user
   - Attach the "AmazonS3FullAccess" policy
   - Save the Access Key ID and Secret Access Key

### Option B: Cloudinary Alternative

1. **Create a Cloudinary Account**:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   
2. **Note Your Credentials**:
   - From your dashboard, note your Cloud name, API Key, and API Secret

3. **Install Cloudinary Package**:
   ```bash
   pip install cloudinary
   ```

4. **Update Settings**:
   - You will need to update the image storage configuration for use of cloudinary instead in settings.py

## 2. Database Setup

### Setting Up PostgreSQL on Render

1. **Create a PostgreSQL Database**:
   - Log in to your Render account
   - Go to Dashboard → New → PostgreSQL
   - Fill in the details:
     - Name: `leadgreen-db` (or your preferred name)
     - Database: `leadgreen`
     - User: Leave as auto-generated or specify your own
     - Region: Choose the one closest to your users
   - Click "Create Database"

2. **Save Connection Information**:
   - After creation, Render will display the connection details
   - Save the following information:
     - Internal Database URL
     - External Database URL
     - Username
     - Password
     - Database name

## 3. Environment Configuration

You'll need to set up environment variables for your production deployment.

1. **Create a Production .env File**:
   Based on your current .env file, create a production version with the following variables:

   ```
   DEBUG=False
   DJANGO_SECRET_KEY=your_secure_production_secret_key
   PYTHON_VERSION=your_python_version
   
   # Database configuration
   DATABASE_URL=your_postgres_connection_string
   
   # AWS S3 configuration (if using AWS)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_STORAGE_BUCKET_NAME=your_bucket_name
   AWS_S3_REGION_NAME=your_bucket_region
   
   # Cloudinary configuration (if using Cloudinary)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Other application-specific settings
   ALLOWED_HOSTS=.render.com,your-custom-domain.com
   CORS_ALLOWED_ORIGINS=.render.com,your-custom-domain.com
   ```

2. **Generate a Secure Secret Key**:
   ```python
   python -c "import secrets; print(secrets.token_urlsafe(50))"
   ```
   Use the output as the DJANGO_SECRET_KEY.

## 4. Deploying the Backend to Render

1. **Push The Code to GitHub**:
   Ensure the code is in a GitHub repository.

2. **Create a New Web Service on Render**:
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Name: `leadgreen-backend` (or your preferred name)
   - Environment: Python
   - Build Command: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - Start Command: 
     ```bash
     gunicorn backend.wsgi:application
     ```

3. **Add Environment Variables**:
   - In the Render dashboard for your web service
   - Go to Environment → Add Environment Variables
   - Add all variables from your production .env file

4. **Add the PostgreSQL Add-on**:
   - Go to your web service settings
   - In the "Outbound" section, add your PostgreSQL database

5. **Deploy Your Service**:
   - Click "Create Web Service"
   - Render will deploy your application

## 5. Connecting Services

### Update Django Settings

Ensure your Django settings are properly configured for production:

1. **Update Database Settings**:
   Make sure your `settings.py` includes:
   ```python
   import dj_database_url
   import os
   
   # Database
   DATABASES = {
       'default': dj_database_url.config(
           default=os.environ.get('DATABASE_URL'),
           conn_max_age=600
       )
   }
   ```

2. **Configure Static and Media Files**:
   For AWS S3:
   ```python
   DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
   STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
   
   AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
   AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
   AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
   AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME')
   AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
   AWS_DEFAULT_ACL = 'public-read'
   AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
   ```

   For Cloudinary:
   ```python
   import cloudinary
   import cloudinary.uploader
   import cloudinary.api
   
   cloudinary.config(
       cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
       api_key=os.environ.get('CLOUDINARY_API_KEY'),
       api_secret=os.environ.get('CLOUDINARY_API_SECRET')
   )
   
   DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
   ```

3. **Update requirements.txt**:
   Make sure these packages are included:
   ```
   dj-database-url
   gunicorn
   psycopg2-binary
   whitenoise
   django-storages
   boto3
   ```

## 6. Post-Deployment Verification

1. **Run Migrations**:
   - Go to your web service in Render
   - Open the Shell tab
   - Run:
     ```bash
     python manage.py migrate
     ```

2. **Create Superuser** (if needed):
   ```bash
   python manage.py createsuperuser
   ```

3. **Test Endpoints**:
   - Visit your API endpoints to ensure they're working
   - Test image uploads to verify storage configuration

## 7. Troubleshooting

### Database Connection Issues
- Verify the DATABASE_URL is correct
- Check if the database service is running
- Ensure the database user has proper permissions

### Static/Media Files Not Loading
- Verify AWS/Cloudinary credentials
- Check CORS settings in your S3 bucket
- Test file uploads from the Django admin panel

### Application Errors
- Check Render logs for error messages
- Verify environment variables are set correctly
- Test the application locally with production settings

---

For additional help or questions, please refer to:
- [Render Documentation](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
