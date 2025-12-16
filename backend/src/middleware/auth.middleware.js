import jwt from 'jsonwebtoken';
import {ENV} from '../lib/env.js';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized access Token missing"});  
        }   

        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized access Invalid Token"});
        }
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({message:"Unauthorized access User not found"});
        }
        req.user = user;
        next();
    }catch(error){
        console.log("Error in protectRoute middleware:",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}