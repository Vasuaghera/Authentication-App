import React, { useState } from 'react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: [
        {
          title: 'Project Setup',
          content: `Clone the repository and install dependencies:

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/authentication-app.git
cd authentication-app

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
\`\`\``
        },
        {
          title: 'Environment Configuration',
          content: `Set up your environment variables:

\`\`\`env
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
\`\`\``
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Structure',
      content: [
        {
          title: 'Project Structure',
          content: `The backend follows a modular structure:

\`\`\`
Backend/
├── config/         # Configuration files
│   ├── mongoDB.js  # Database connection
│   ├── nodemailer.js # Email configuration
│   └── passport.js # Google OAuth configuration
├── controllers/    # Route controllers
│   ├── auth.js     # Authentication logic
│   ├── profile.js  # Profile management
│   └── userDetail.js # User details management
├── middleware/     # Custom middleware
│   └── auth.js     # Authentication middleware
├── models/         # Database models
│   └── user.js     # User model
├── routes/         # API routes
│   ├── authRoute.js    # Auth routes
│   ├── profileRoute.js # Profile routes
│   └── userDetailRoute.js # User routes
└── server.js       # Main application file
\`\`\``
        },
        {
          title: 'API Endpoints',
          content: `Available API endpoints:

\`\`\`javascript
// Authentication Routes
POST /api/auth/register      // Register new user
POST /api/auth/login         // User login
GET  /api/auth/logout        // User logout
GET  /api/auth/isAuthenticated // Check auth status
GET  /api/auth/google        // Google OAuth login
GET  /api/auth/google/callback // Google OAuth callback

// Password Reset Routes
POST /api/auth/send-reset-otp  // Send reset OTP
POST /api/auth/reset-password  // Reset password

// Profile Routes
GET  /api/profile/details     // Get profile details
PUT  /api/profile/update      // Update profile

// User Routes
GET  /api/user/data          // Get user data
\`\`\``
        },
        {
          title: 'Authentication Implementation',
          content: `Authentication implementation details:

\`\`\`javascript
// Google OAuth Configuration (config/passport.js)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await userModel.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: Math.random().toString(36).slice(-8),
                isVerified: true
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Session Configuration (server.js)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
\`\`\``
        }
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Structure',
      content: [
        {
          title: 'Project Structure',
          content: `The frontend is built with React and Vite:

\`\`\`
Frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx  # Navigation bar
│   │   ├── Header.jsx  # Landing page header
│   │   ├── Profile.jsx # User profile
│   │   ├── Features.jsx # Features section
│   │   └── Pricing.jsx # Pricing section
│   ├── pages/         # Page components
│   │   ├── Home.jsx   # Landing page
│   │   ├── Login.jsx  # Login page
│   │   ├── Register.jsx # Registration page
│   │   ├── ForgotPassword.jsx # Password reset
│   │   ├── PasswordReset.jsx # Reset password
│   │   ├── Profile.jsx # User profile
│   │   ├── Documentation.jsx # Documentation
│   │   └── Privacy.jsx # Privacy policy
│   ├── context/       # React context
│   │   └── MainContext.jsx # Global state
│   └── assets/        # Static assets
\`\`\``
        },
        {
          title: 'Component Details',
          content: `Key components and their features:

\`\`\`jsx
// Navbar Component
<Navbar />
Features:
- Responsive navigation
- Dark/Light mode toggle
- User authentication state
- Mobile menu
- Google OAuth integration

// Profile Component
<Profile />
Features:
- User profile management
- Form validation
- Address management
- Responsive design
- Dark mode support

// Authentication Components
<Login />
Features:
- Email/Password login
- Google OAuth login
- Form validation
- Error handling
- Responsive design

<ForgotPassword />
Features:
- Email verification
- OTP system
- Password reset
- Form validation
- Responsive design

// Documentation Component
<Documentation />
Features:
- Interactive sidebar
- Code examples
- Dark mode support
- Responsive layout
- Syntax highlighting

// Context Implementation
const MainContext = createContext({
    userData: null,
    isLoggedIn: false,
    BackendUrl: import.meta.env.VITE_BACKEND_URL,
    setIsLoggedIn: () => {},
    setUserData: () => {},
    getUserData: () => {}
});
\`\`\``
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      content: [
        {
          title: 'Authentication Features',
          content: `The application includes the following authentication features:

\`\`\`
1. User Authentication
   - Email/Password login
   - Google OAuth integration
   - JWT-based authentication
   - Session management
   - Secure password hashing

2. Password Management
   - Password reset via email
   - OTP verification
   - Password strength validation
   - Secure password storage

3. User Profile
   - Profile information management
   - Address management
   - Form validation
   - Real-time updates

4. Security Features
   - CSRF protection
   - XSS prevention
   - Secure cookie handling
   - Rate limiting
   - Input validation

5. UI/UX Features
   - Responsive design
   - Dark/Light mode
   - Loading states
   - Error handling
   - Toast notifications
   - Form validation
   - Mobile-first approach
\`\`\``
        },
        {
          title: 'Technical Features',
          content: `Technical implementation details:

\`\`\`
1. Frontend
   - React with Vite
   - Tailwind CSS for styling
   - Context API for state management
   - Axios for API calls
   - React Router for navigation
   - React Hot Toast for notifications
   - AOS for animations

2. Backend
   - Node.js with Express
   - MongoDB with Mongoose
   - JWT for authentication
   - Passport.js for OAuth
   - Nodemailer for emails
   - Express-session for sessions
   - Cookie-parser for cookies

3. Development Features
   - Hot module replacement
   - Environment configuration
   - Error logging
   - API documentation
   - Code splitting
   - Responsive testing
\`\`\``
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      content: [
        {
          title: 'Backend Deployment',
          content: `Deploy the backend:

\`\`\`bash
# Build the application
cd Backend
npm install
npm run build

# Set environment variables
export PORT=4000
export MONGODB_URL=your_production_mongodb_uri
export JWT_SECRET=your_production_jwt_secret
export SMTP_USER=your_production_email
export SMTP_PASS=your_production_email_password
export GOOGLE_CLIENT_ID=your_production_google_client_id
export GOOGLE_CLIENT_SECRET=your_production_google_client_secret
export GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
export SESSION_SECRET=your_production_session_secret

# Start the server
npm start
\`\`\``
        },
        {
          title: 'Frontend Deployment',
          content: `Deploy the frontend:

\`\`\`bash
# Build the application
cd Frontend
npm install
npm run build

# The build output will be in the 'dist' directory
# Deploy the contents of 'dist' to your hosting service

# Update environment variables
VITE_BACKEND_URL=https://your-backend-domain.com
\`\`\``
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentation
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`${
                  activeSection === section.id ? 'block' : 'hidden'
                }`}
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-200">
                  {section.title}
                </h1>
                <div className="space-y-12">
                  {section.content.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                        {item.title}
                      </h2>
                      <div className="prose prose-indigo dark:prose-invert max-w-none">
                        <pre className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto transition-colors duration-200">
                          <code className="text-gray-800 dark:text-gray-200">{item.content}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation; 