import express from "express" ;
import cors from "cors" ;
import 'dotenv/config' ;
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRoute from './routes/authRoute.js';
import userDetailRouter from "./routes/userDetailRoute.js";

const app = express() ;
const port = process.env.PORT || 4000 ;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json()) ;
app.use(cookieParser()) ;
app.use(cors({
    
    origin : allowedOrigins,
    // So we can send the cookie in the response from the express app
    credentials:true 
})) ;

app.get("/" , (req,res) => res.send("Barobar chhe"))
app.use('/api/auth',authRoute);
app.use('/api/user',userDetailRouter) ;

app.listen(port , () => console.log(`Server started on port no : ${port}`));


