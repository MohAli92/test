# Share Dish - MongoDB Authentication

Share Dish is a food sharing platform where users can share and discover meals. This version uses MongoDB for authentication instead of Firebase.

## Features

- User authentication with MongoDB and JWT
- WhatsApp verification for phone numbers
- Create, edit, and delete food posts
- Real-time messaging between users
- User profiles and account management
- Image upload with Cloudinary

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Twilio account (for WhatsApp verification)
- Cloudinary account (for image uploads)

## Environment Variables

### Server (.env file in server directory)

Create a `.env` file in the `server` directory with the following variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Client (.env file in client directory)

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd share-dish-project-main
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` files in both `server` and `client` directories
   - Add the required environment variables as shown above

## Running the Application

1. **Start the server**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the client**
   ```bash
   cd client
   npm start
   ```
   The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/send-whatsapp-code` - Send WhatsApp verification code
- `POST /api/auth/verify-whatsapp-code` - Verify WhatsApp code

### Users
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user account

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/reserve` - Mark post as reserved
- `POST /api/posts/upload` - Upload image

### Chat
- `POST /api/chat/start` - Start a new chat
- `GET /api/chat/user/:userId` - Get user's chats
- `POST /api/chat/:postId/message` - Send message
- `GET /api/chat/:postId/:userId1/:userId2` - Get chat messages

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String,
  lastName: String,
  gender: String (enum: ['male', 'female', 'other', 'prefer-not-to-say']),
  phone: String (unique),
  phoneVerified: Boolean,
  createdAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  photo: String,
  ingredients: [String],
  allergies: [String],
  city: String,
  address: String,
  time: Date,
  description: String,
  reserved: Boolean,
  createdAt: Date
}
```

### Chat
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: 'Post'),
  users: [ObjectId] (ref: 'User'),
  messages: [{
    sender: ObjectId (ref: 'User'),
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

## WhatsApp Verification Setup

1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Set up WhatsApp Sandbox by sending "join government-think" to +14155238886
4. Add the Twilio credentials to your server `.env` file

## Cloudinary Setup

1. Create a Cloudinary account
2. Get your Cloud Name, API Key, and API Secret
3. Add the credentials to your server `.env` file

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Twilio for WhatsApp integration
- Cloudinary for image uploads
- Socket.io for real-time messaging

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls
- Context API for state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 