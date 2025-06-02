# Authentication App

A full-stack authentication application with features like email/password login, Google OAuth, password reset, and user profile management.

## Features

- 🔐 Secure Authentication
  - Email/Password login
  - Google OAuth integration
  - JWT-based authentication
  - Session management
  - Secure password hashing

- 🔄 Password Management
  - Password reset via email
  - OTP verification
  - Password strength validation
  - Secure password storage

- 👤 User Profile
  - Profile information management
  - Address management
  - Form validation
  - Real-time updates

- 🛡️ Security Features
  - CSRF protection
  - XSS prevention
  - Secure cookie handling
  - Rate limiting
  - Input validation

- 🎨 UI/UX Features
  - Responsive design
  - Dark/Light mode
  - Loading states
  - Error handling
  - Toast notifications
  - Form validation
  - Mobile-first approach

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- Context API for state management
- Axios for API calls
- React Router for navigation
- React Hot Toast for notifications
- AOS for animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for OAuth
- Nodemailer for emails
- Express-session for sessions
- Cookie-parser for cookies

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/authentication-app.git
cd authentication-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. Set up environment variables:
```env
# Backend (.env in Backend directory)
PORT=4000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
SESSION_SECRET=your_session_secret

# Frontend (.env in Frontend directory)
VITE_BACKEND_URL=http://localhost:4000
```

4. Start the development servers:
```bash
# Start backend server
cd Backend
npm run dev

# Start frontend server
cd Frontend
npm run dev
```

## API Documentation

### Authentication Routes
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/logout - User logout
- GET /api/auth/isAuthenticated - Check auth status
- GET /api/auth/google - Google OAuth login
- GET /api/auth/google/callback - Google OAuth callback

### Password Reset Routes
- POST /api/auth/send-reset-otp - Send reset OTP
- POST /api/auth/reset-password - Reset password

### Profile Routes
- GET /api/profile/details - Get profile details
- PUT /api/profile/update - Update profile

### User Routes
- GET /api/user/data - Get user data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 