import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userDetail.js";

const userDetailRoute = express.Router() ;

userDetailRoute.get('/data',userAuth , getUserData);

export default userDetailRoute ;