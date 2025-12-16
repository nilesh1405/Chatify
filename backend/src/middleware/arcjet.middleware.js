import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req,res,next)=>{
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message:"Too many requests. Please try again later."});
            }else if(decision.reason.isBot()){
                return res.status(403).json({message:"Bot Access denied."});
            }else{
                return res.status(403).json({message:"Access denied."});
            }
        }

        if(isSpoofedBot(decision)){
            return res.status(403).json({message:"Spoofed Bot Access denied."});
        }
        next();

    } catch (error) {
        console.error("Arcjet error:", error);
        next();
    }
}