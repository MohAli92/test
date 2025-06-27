# 🚀 Share Dish - CodeSpaces Setup Guide

This guide will help you set up and run Share Dish in GitHub CodeSpaces.

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] MongoDB Atlas account with a cluster
- [ ] Twilio account (for WhatsApp verification)
- [ ] Cloudinary account (for image uploads)
- [ ] GitHub account with CodeSpaces access

## 🛠️ Quick Setup

### 1. **Open in CodeSpaces**
1. Go to your GitHub repository
2. Click the green "Code" button
3. Select "Create codespace on main"
4. Wait for the environment to build

### 2. **Set Environment Variables**
Once CodeSpaces opens, you need to set up your environment variables:

#### Server Environment (.env in server folder)
```bash
# In the terminal, navigate to server folder
cd server

# Create .env file
cat > .env << 'EOF'
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF
```

#### Client Environment (.env in client folder)
```bash
# Navigate to client folder
cd ../client

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000
EOF
```

### 3. **Install Dependencies**
```bash
# Install server dependencies
cd ../server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. **Start the Application**

#### Terminal 1 - Start Server
```bash
cd server
npm start
```

#### Terminal 2 - Start Client
```bash
cd client
npm start
```

### 5. **Access the Application**
- **React App**: Click on the forwarded port 3000 in the "PORTS" tab
- **Server API**: Click on the forwarded port 5000 in the "PORTS" tab
- **Health Check**: Visit `http://localhost:5000/health`

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Port Forwarding Issues**
- Make sure ports 3000 and 5000 are forwarded
- Check the "PORTS" tab in CodeSpaces
- Try refreshing the port forwarding

#### 2. **MongoDB Connection Issues**
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- For CodeSpaces, you might need to whitelist `0.0.0.0/0` temporarily

#### 3. **CORS Issues**
- The server is configured to allow CodeSpaces origins
- Check the browser console for CORS errors
- Verify the API URL in client/.env

#### 4. **Environment Variables Not Loading**
- Make sure .env files are in the correct locations
- Restart the server after changing .env files
- Check file permissions

#### 5. **Dependencies Not Installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 6. **File Upload Issues**
- Check Cloudinary credentials
- Verify file size limits
- Check network connectivity

## 📱 Testing the Application

### 1. **Health Check**
Visit: `http://localhost:5000/health`
Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "mongodb": "connected"
}
```

### 2. **API Endpoints**
- `GET /api/posts` - List all posts
- `POST /api/auth/signup` - Register user
- `POST /api/auth/signin` - Login user

### 3. **Frontend**
- Open the React app on port 3000
- Try registering a new user
- Test image upload functionality
- Test messaging between users

## 🔒 Security Notes

### For Development Only
- The current CORS settings allow all CodeSpaces origins
- JWT secret should be strong in production
- MongoDB connection should be restricted in production

### Environment Variables
- Never commit .env files to Git
- Use GitHub Secrets for production deployments
- Rotate API keys regularly

## 🚀 Production Deployment

When ready for production:
1. Set up proper CORS origins
2. Use environment-specific configurations
3. Set up proper MongoDB security
4. Configure proper logging
5. Set up monitoring and alerts

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs in the terminal
3. Verify all environment variables are set
4. Test the health endpoint
5. Check MongoDB Atlas dashboard

## 🎉 Success Indicators

Your setup is working correctly when:
- ✅ Server starts without errors
- ✅ MongoDB connection is established
- ✅ React app loads in the browser
- ✅ User registration works
- ✅ Image upload works
- ✅ Messaging works
- ✅ Health endpoint returns OK status 