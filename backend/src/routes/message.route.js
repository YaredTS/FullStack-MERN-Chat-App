import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controller/message.controller.js";
import {getMessages} from "../controller/message.controller.js"
import {sendMessage} from "../controller/message.controller.js"

const router = express.Router()

// on the left hand side we are fetching users so this is the endpoint (must be protected not every one should call it) only if u are auth
router.get("/users", protectRoute, getUsersForSidebar)

//the next end point is to get messages between two users
// the user id we would like to fetch our messages with 
router.get("/:id", protectRoute, getMessages) // "/:id" is dynamic value

//to send messages (":id is reciever id")
router.post("/send/:id",protectRoute, sendMessage)

export default router;