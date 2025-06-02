import express from "express" ;
import cors from "cors" ;
import 'dotenv/config' ;
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from "./config/mongoDB.js";
import authRoute from './routes/authRoute.js';
import userDetailRouter from "./routes/userDetailRoute.js";
import profileRoute from './routes/profileRoute.js';

const app = express() ;
const port = process.env.PORT || 4000 ;
connectDB();

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',  // Vite default port
    'http://localhost:3000',  // React default port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://authentication-app-9.onrender.com',  // Your frontend URL
    'https://authentication-app-4-21op.onrender.com' // Your backend URL
];

app.use(express.json()) ;
app.use(cookieParser()) ;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        path: '/',
        domain: '.onrender.com' // Add this to allow cookie sharing between subdomains
    },
    name: 'sessionId' // Add a specific name for the session cookie
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            if (process.env.NODE_ENV === 'production') {
                return callback(null, true);
            }
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}));

// Add headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get("/" , (req,res) => res.send("Barobar chhe"))
app.use('/api/auth',authRoute);
app.use('/api/user',userDetailRouter) ;
app.use('/api/profile', profileRoute);

app.listen(port , () => console.log(`Server started on port no : ${port}`));


