#!/bin/bash

echo "🚀 Setting up Share Dish for CodeSpaces..."

# Check if we're in CodeSpaces
if [ -n "$CODESPACES" ]; then
    echo "📦 Detected CodeSpaces environment"
    
    # Install dependencies
    echo "📥 Installing server dependencies..."
    npm install
    
    echo "📥 Installing client dependencies..."
    cd client && npm install && cd ..
    
    # Create environment files if they don't exist
    if [ ! -f "server/.env" ]; then
        echo "📝 Creating server .env file..."
        cat > server/.env << EOF
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
        echo "⚠️  Please update server/.env with your actual credentials"
    fi
    
    if [ ! -f "client/.env" ]; then
        echo "📝 Creating client .env file..."
        cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF
    fi
    
    echo "✅ Setup complete!"
    echo "📋 Next steps:"
    echo "1. Update server/.env with your MongoDB and other API credentials"
    echo "2. Run 'npm start' in the server directory"
    echo "3. Run 'npm start' in the client directory"
    echo "4. Open the forwarded ports in CodeSpaces"
    
else
    echo "💻 Local environment detected"
    echo "📥 Installing dependencies..."
    npm install
    cd client && npm install && cd ..
    echo "✅ Setup complete!"
fi 