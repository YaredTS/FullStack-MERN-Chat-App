import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;  // parse the cookie so you can grab values by the name (jwt)

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
    // if there is token check if it is valid or not(if it expire or not)
    // to do we must grab the token from the cookies to be able to do that we are going to use the package called (cookie-parser)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
//we are going to verity this token from the cookies with this private key(JWT_SECRET)
// this is the secret that we use to create token so to decode it we should use exact same secret  
         if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
         }
         // if it passes we will try to find the user in the database 
         const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        req.user = user // add this user field to te request which is the user we got in the database

        next();
    }catch(error){
        console.log("Error in protectRoute middleware:", error.message)
        res.status(401).json({ message: "Unauthorized - Token Error" });
    }
}

