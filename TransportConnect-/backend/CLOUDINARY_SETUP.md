# Cloudinary Setup Instructions

## Required Packages

Install the following packages in the backend:

```bash
npm install cloudinary multer multer-storage-cloudinary
```

## Environment Variables

Add these to your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Cloudinary Credentials

1. Sign up at https://cloudinary.com
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

## Features

- Profile picture upload from device
- Automatic image optimization (400x400, face detection)
- Old avatar deletion when uploading new one
- Avatar display across all pages (Profile, Layout header, Requests, Trips, etc.)

