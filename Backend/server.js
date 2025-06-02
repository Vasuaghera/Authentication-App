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
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Set to true for HTTPS
        sameSite: 'none', // Required for cross-origin requests
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            // In production, be more permissive
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
    allowedHeaders: ['Content-Type', 'Authorization']
})) ;

app.get("/" , (req,res) => res.send("Barobar chhe"))
app.use('/api/auth',authRoute);
app.use('/api/user',userDetailRouter) ;
app.use('/api/profile', profileRoute);

app.listen(port , () => console.log(`Server started on port no : ${port}`));


