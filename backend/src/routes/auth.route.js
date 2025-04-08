import express from "express"
import { login, logout, signup,updateProfile,checkAuth } from "../controller/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router()
 
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout)

// there is one more route where we can update profile  
router.put("/update-profile", protectRoute, updateProfile)
// we don't want to call this function for every user, They should be Authenticated
// if user wants to update profile first it must be authenticated (check if they are logged in) protectRoute if there are we will call the next function

//Authentication(check if user is auth or not)
router.get("/check", protectRoute, checkAuth)

export default router;