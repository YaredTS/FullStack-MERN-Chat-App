import {generateToken} from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

// user will send you some information like email , fullname,  password to signup
// to grab those go to index.js and add middlelayer to extract file
export const signup = async(req,res) => {
    const {fullName, email , password} = req.body
            // signup the user ,create token(JWT) to let them know they are authenticated
            // hash the password (bcryptjs) if the password is 123456 we don't want to save it as it is on the database so it will save it like 7r5ofwen;tu40j kinda
    try{ 
    if(!fullName || !email || !password){
        return res.status(400).json({message: "ALL field are required"})
    }
    if (password.length < 6 ){
        return res.status(400).json({message: "Password must be at least 6 character"})
    }
         // move on to create user , check if user exist in this email
    const user =await User.findOne({email})
    // if user exist
    if (user) return res.status(400).json({message: "Email already exists"});
    // hash the password genSalt(generate salt)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new User ({
        // fullName: fullName,
        fullName,  // since fullname and email are the same short it 
        email,
        password: hashedPassword
    })
    if (newUser) {
    // save the user to the database (generate JWT token)
    // create function to make the codebase clean (we have created function on utils.js)
      generateToken(newUser._id,res) // res (so it can send response cookie)
      await newUser.save(); // save to the database 

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })
    }else {
        res.status(400).json({message:"Invalid user data"})
    }

   } catch (error) {
    console.log("Error in signup controller", error.message)
    res.status(500).json({message:"Internal Server Error"})
   }
    };
// Test this endpoint to check if the function work (saving user to database,hashing the password and generate jwt) we will use desktop app called POSTMAN

export const login = async (req,res) => {
     // condition the user will send us email and password we are going to check if it exist and correct

    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if (!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    }catch (error){
        console.log("Error in login controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
};

export const logout = (req,res) => {
     // if user is loggingout there is one thing that we should be doing that's clear out the cookie
    try{
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    }catch(error){
        console.log("Error in logout controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
};


// we don't want to call this function for every user, They should be Authenticated
// to be able to update our profile image we need a service so that we can upload our images (cloudinary)
export const updateProfile = async(req,res) => {
    try{
 // when user want to update profile image first send us the pic
        const {profilePic} = req.body
  // check which user it is 
        const userId = req.user._id   // we will req the user which is in the middleware

        if (!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        // updata the user in the database , cloudinary is not our database but bucket to our images
        // update profilepic in the database for this user 
        const updatedUser = await User.findByIdAndUpdate(userId, 
                                       {profilePic:uploadResponse.secure_url},
                                        {new:true}) // {new:true} give you object after update

        res.status(200).json(updatedUser)

    }catch(error){
        console.log("error in update profile:", error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const checkAuth = (req,res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}