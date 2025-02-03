# Backend README.md:

````markdown
# AI Chat Application Backend

A robust Node.js backend server powering the AI Chat Application with real-time messaging capabilities and AI integration.

## Features

- 🔒 JWT Authentication
- 🚀 Real-time WebSocket Communication
- 🤖 AI Service Integration
- 📊 Redis Caching
- 🗄️ MongoDB Database
- 🔄 RESTful API
- 🛡️ Middleware Security
- 📝 User Management
- 📋 Project Management

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Socket.IO
- Redis
- JWT
- AI Integration Services

## Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 4.4
- Redis >= 6.0
- npm >= 8.0.0

## Installation

1. Clone the repository:
   ```bash
   git clone
   cd backend
   ```
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ai-chat
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   AI_API_KEY=your_ai_service_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── services/       # Business logic
└── db/            # Database configuration
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `GET /api/users/login` - User login
- `GET /api/users/logout` - User logout
- `GET /api/users/all` - Get all users (protected)

### Projects

- `POST /api/project/create` - Create new project
- `GET /api/project/get-project/:id` - Get project by ID
- `PUT /api/project/add-user` - Add users to project

### AI Integration

- `GET /api/ai/get-result` - GET response from AI

## WebSocket Events

- `connection` - Client connects
- `disconnect` - Client disconnects
- `project-message` - New message in project

## Services

### User Service

- User authentication using Redis
- Profile management
- Authorization

### Project Service

- Project creation/management
- Collaboration handling
- Message management

### AI Service

- AI model integration
- Message processing
- Response generation

## Error Handling

The API uses standard HTTP response codes:

- 200: Success
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

## Setup and Run

### Setup

```bash
npm run setup
```

### Development Server

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- MongoDB for database
- Socket.IO for real-time communication
- Redis for caching
- AI service providers

```
```
