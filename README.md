# Share Dish - Food Sharing Platform

A full-stack web application for sharing food items with your community. Built with React, Node.js, and MongoDB.

## 🌟 Features

- **User Authentication**: Secure login/signup with JWT
- **Food Posts**: Create, edit, and delete food sharing posts
- **Image Upload**: Drag-and-drop image upload with Cloudinary
- **Real-time Chat**: WhatsApp integration for communication
- **Responsive Design**: Works on desktop and mobile devices
- **CodeSpaces Ready**: Full GitHub CodeSpaces support

## 🚀 Quick Start

### Option 1: GitHub CodeSpaces (Recommended)

1. **Open in CodeSpaces**:
   - Click the green "Code" button on this repository
   - Select "Open with Codespaces"
   - Choose "Create codespace on main"

2. **Run Setup Script**:
   ```bash
   bash setup-codespaces.sh
   ```

3. **Configure Environment**:
   - Update `server/.env` with your actual credentials
   - See [Environment Variables](#environment-variables) section

4. **Start the Application**:
   ```bash
   # Terminal 1 - Start Server
   cd server && npm start
   
   # Terminal 2 - Start Client
   cd client && npm start
   ```

5. **Access the App**:
   - Server: `https://localhost:5000`
   - Client: `https://localhost:3000`
   - Ports are automatically forwarded in CodeSpaces

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd share-dish-project-main
   ```

2. **Install dependencies**:
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Set up environment variables**:
   - Copy `server/.env.example` to `server/.env`
   - Update with your actual credentials

4. **Start the application**:
   ```bash
   # Terminal 1 - Start Server
   cd server && npm start
   
   # Terminal 2 - Start Client
   cd client && npm start
   ```

## 🔧 Environment Variables

### Server (.env)

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/share-dish

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

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
```

### Client (.env)

```env
# React App Environment Variables
REACT_APP_CODESPACES=true
REACT_APP_API_URL=http://localhost:5000
```

## 📋 Prerequisites

### For Local Development:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Twilio account (for WhatsApp)
- Cloudinary account (for image uploads)

### For CodeSpaces:
- GitHub account
- No local setup required!

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/send-whatsapp-code` - Send WhatsApp verification
- `POST /api/auth/verify-whatsapp-code` - Verify WhatsApp code

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/reserve` - Reserve post
- `POST /api/posts/upload` - Upload image

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Chat
- `GET /api/chat/user/:userId` - Get user chats
- `POST /api/chat/start` - Start new chat
- `POST /api/chat/:postId/message` - Send message
- `GET /api/chat/:postId/:userId1/:userId2` - Get chat messages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- File upload restrictions
- Environment variable protection

## 🌐 CodeSpaces Configuration

The project is fully configured for GitHub CodeSpaces with:

- **Dev Container**: Pre-configured development environment
- **Port Forwarding**: Automatic port forwarding for 3000 and 5000
- **Dynamic URLs**: Automatic API URL detection
- **CORS Support**: Configured for CodeSpaces domains
- **Environment Detection**: Automatic environment variable setup

### CodeSpaces Features:

1. **Automatic Setup**: Run `bash setup-codespaces.sh` for one-click setup
2. **Dynamic API URLs**: Automatically detects CodeSpaces environment
3. **Port Forwarding**: No manual port configuration needed
4. **CORS Handling**: Pre-configured for CodeSpaces domains
5. **Environment Variables**: Automatic detection and setup

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure server is running on port 5000
   - Check that client is making requests to correct URL
   - In CodeSpaces, URLs are automatically detected

2. **MongoDB Connection Failed**:
   - Verify MONGO_URI in server/.env
   - Check network connectivity
   - Ensure IP is whitelisted in MongoDB Atlas

3. **Image Upload Failed**:
   - Verify Cloudinary credentials
   - Check file size (max 10MB)
   - Ensure file is an image

4. **WhatsApp Verification Failed**:
   - Verify Twilio credentials
   - Check phone number format (include country code)
   - Ensure Twilio WhatsApp is enabled

### CodeSpaces Specific:

1. **Ports Not Accessible**:
   - Check port forwarding in CodeSpaces
   - Ensure both server and client are running
   - Use the provided URLs in the terminal output

2. **API Calls Failing**:
   - The app automatically detects CodeSpaces environment
   - Check browser console for specific errors
   - Verify server is running and accessible

## 📱 Features

- **User Registration/Login**: Secure authentication system
- **Food Post Creation**: Share food items with images and details
- **Real-time Chat**: WhatsApp integration for communication
- **Image Upload**: Drag-and-drop image upload
- **Post Management**: Edit, delete, and reserve posts
- **Responsive Design**: Mobile-friendly interface
- **Search and Filter**: Find specific food items
- **User Profiles**: Manage personal information

## 🛡️ Security

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable protection
- File upload restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the console logs
3. Verify environment variables
4. Create an issue with detailed error information

## 🎯 Roadmap

- [ ] Push notifications
- [ ] Advanced search filters
- [ ] User ratings and reviews
- [ ] Payment integration
- [ ] Mobile app
- [ ] Social media sharing
- [ ] Recipe suggestions
- [ ] Nutritional information 