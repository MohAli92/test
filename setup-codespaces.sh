#!/bin/bash

echo "🚀 Setting up Share Dish project for GitHub CodeSpaces..."

# Check if we're in CodeSpaces
if [ -n "$CODESPACES" ]; then
    echo "✅ Running in GitHub CodeSpaces"
    export REACT_APP_CODESPACES=true
else
    echo "ℹ️  Running locally"
    export REACT_APP_CODESPACES=false
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Create .env file for server if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating server .env file..."
    cat > .env << EOF
# MongoDB Configuration
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/share-dish?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio Configuration (for WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# CodeSpaces Configuration
CODESPACES=$CODESPACES
EOF
    echo "⚠️  Please update the .env file with your actual credentials!"
fi

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Create .env file for client if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating client .env file..."
    cat > .env << EOF
# React App Environment Variables
REACT_APP_CODESPACES=$REACT_APP_CODESPACES
REACT_APP_API_URL=http://localhost:5000

# Note: In CodeSpaces, the API URL will be dynamically detected
# This is just a fallback for local development
EOF
fi

# Go back to root
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your actual credentials"
echo "2. Run the server: cd server && npm start"
echo "3. Run the client: cd client && npm start"
echo ""
echo "🌐 In CodeSpaces:"
echo "- Server will be available at: https://localhost:5000"
echo "- Client will be available at: https://localhost:3000"
echo "- Ports are automatically forwarded in CodeSpaces"
echo ""
echo "🔧 Troubleshooting:"
echo "- If you get CORS errors, check that the server is running"
echo "- If MongoDB connection fails, verify your MONGO_URI"
echo "- If image upload fails, check your Cloudinary credentials" 