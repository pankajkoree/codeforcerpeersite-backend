# CodeForcer Peer Site — Backend

![Node.js](https://img.shields.io/badge/Node.js-25.1.0-lime?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1.x-gray?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-ODM-darkgreen?logo=mongodb)

Backend for the **CodeForcer Peer Site**, a powerful API platform for competitive programmers to connect, collaborate, and track progress. Built with modern web technologies to provide robust performance and scalability.

---

## 🎯 Project Overview

This backend serves as the core server-side application for the CodeForcer Peer Site, providing:

- **🔐 Secure Authentication** - JWT-based auth with password hashing and refresh tokens
- **👥 User Management** - Complete profile management with Codeforces integration
- **🌐 Peer Networking** - Advanced filtering and discovery based on multiple criteria
- **📊 Performance Analytics** - Contest rating tracking and progress monitoring
- **🔒 Role-based Authorization** - Flexible permission system for future scalability

---

## 🛠 Tech Stack

### Core Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security & Authentication

- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token management
- **express-rate-limit** - API rate limiting

### Development & Quality

- **TypeScript** - Type safety and better development experience
- **Prettier & ESLint** - Code formatting and linting
- **Nodemon** - Development server hot reload

---

## 📁 Project Structure

```bash
src/
├── controllers/          # Route controllers
│   └── user.controller.ts
├── models/               # Mongoose models
│   ├── User.ts
│   └── Token.ts
├── routes/               # Express routes
│   └── userRouter.ts
├── middleware/           # Custom middleware
│   ├── authMiddleware.ts
│   └── verifyJWT.ts
├── utils/                # Utilities
│   ├── auth.ts
│   └── generateToken.ts
├── .env.example 
├── Dockerfile
├── package-lock.json
├── package.json         # installation packages
└── app.ts               # Application entry point

```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **MongoDB** 6.0 or higher (local or cloud instance)
- **npm** or **yarn** package manager

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/pankajkoree/codeforcerpeersite-backend.git
   cd codeforcerpeersite-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the project root:

   ```env
   # Database
   DBUSER=username
   DBPASSWORD=password
   DB_URI=mongodburl


   # Authentication
   JWT_SECRET=secret_key
   SESSION_SECRET=session_secret

   #Environment
   NODE_ENV=sometext
   ```

4. **Database Setup**

   ```bash
   # Make sure MongoDB is running
   mongod

   # Or use MongoDB Atlas cloud service
   ```

5. **Run the application**

   ```bash
   # Development mode with hot reload
   npm run dev

   # Production build
   npm run build
   npm start

   ```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| `GET`  | `/register`                 | Register the user        | No            |
| `POST` | `/user`                     | Get all user        | No            |
| `POST` | `/login`                    | User login                | No            |
| `GET`  | `/logout`                   | User logout               | Yes           |
| `GET`  | `/profile`                  | User profile               | Yes           |
| `POST` | `/forgotPassword`           | Request password reset    | No            |


---

## 🔐 Security Features

- **Password Security**: bcrypt hashing with configurable salt rounds
- **JWT Tokens**: Short-lived access tokens with secure refresh token rotation
- **Rate Limiting**: Configurable request limits to prevent abuse
- **Input Validation**: Comprehensive request validation and sanitization
- **Security Headers**: Helmet.js for secure HTTP headers
- **CORS Protection**: Configurable cross-origin resource sharing


---

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```env
DBUSER=username
DBPASSWORD=password
DB_URI=mongodburl
JWT_SECRET=secret_key
SESSION_SECRET=session_secret
NODE_ENV=sometext
```

### Docker Deployment

```dockerfile
# Use Node 20 LTS as base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm install

# Copy rest of the project
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

# Expose runtime port (Back4App injects PORT)
EXPOSE 3000

# Start the compiled app
CMD ["npm", "start"]

```


---

## 📈 Roadmap

### Phase 1 (Current)

- ✅ User authentication & authorization
- ✅ Basic profile management
- ✅ Peer discovery system
- ✅ Codeforces integration

### Phase 2 (In Progress)

- 🔄 Real-time notifications
- 🔄 Advanced search filters
- 🔄 Connection request system
- 🔄 Performance analytics dashboard

### Phase 3 (Planned)

- 📅 Contest reminder system
- 📅 Study group formation
- 📅 Code review system
- 📅 Mobile app development




---

## 🙏 Acknowledgments

- **Codeforces API** for providing competitive programming data
- **Express.js** community for excellent documentation and middleware
- **MongoDB** for robust database solutions
- **TypeScript** for providing type safety in js
---


**Happy Coding!** 🚀

---

**Built with ❤️ for the Codeforces community**

*Star us on GitHub if you find this project helpful!* ⭐
