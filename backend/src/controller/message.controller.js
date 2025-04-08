import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encryptText, decryptText } from  "../lib/encryption.js"

// we want to fetch every single user except our self
export const getUsersForSidebar = async (req,res) => {
     try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password")
        // "Find all users where _id is NOT equal to loggedInUserId" ,The logged-in user will not appear in the results.

        res.status(200).json(filteredUsers)
     }catch (error){
        console.error("Error is getUsersForSidebar:", error.message)
        res.status(500).json({error: "Internal server error"})
     }
}


// the next end point is to get messages between two users(get messages between two different users)
export const getMessages = async(req,res) => {
    try{
        const {id: userToChatId} = req.params
// is using object destructuring to extract the id parameter from req.params and rename it as userToChatId
// id is renamed to userToChatId, which represents the ID of the user you're trying to chat with.
// This value usually comes from the URL parameter in an API endpoint like:  GET /chat/:id
        const myId = req.user._id;// currently authenticated user

        // finds messages(filter : find all the messages where i am the sender or the other is the sender)
        const messages = await Message.find({
            $or : [
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        // Decrypt messages before sending them to the frontend
        const decryptedMessages = messages.map((msg) => ({
            ...msg._doc, // Convert Mongoose object to plain JS object
            text: decryptText(msg.text),
        }));

        res.status(200).json(decryptedMessages);
        
    }catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}



// send message(when sending message it could be image as well as text)
export const sendMessage = async(req,res) => {
    try{
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        const encryptedText = encryptText(text); // Encrypt message
 
     // if the user sends us the image or not
    let imageUrl;
    if(image) {
        // upload base64 image to cloudinary
       const uploadResponse = await cloudinary.uploader.upload(image);
       imageUrl = uploadResponse.secure_url;
    }
    
    // know we will create the message 
    const newMessage = new Message({
        senderId,
        receiverId,
        text: encryptedText,
        image: imageUrl,
    })

    await newMessage.save();// when ever we send message we are going to save it to the database then we like to send this to the user in real time 

                // Try decrypting safely
    let decryptedTextToEmit;
    try {
        decryptedTextToEmit = decryptText(newMessage.text);
    } catch (e) {
        decryptedTextToEmit = "[Unable to decrypt message]";
    }

    const messageToSend = {
        ...newMessage._doc,
        text: decryptedTextToEmit,
    };

    // todo : real time functionality goes here => socket.io  
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){ 
    // if receiverSocketId existed that means user is online send the message sent the even in realtime
    // io.emit() - since this broadcast the message to every one we will make some adjustment 
    io.to(receiverSocketId).emit("newMessage", messageToSend) // emit this method called "newMessage" is just name
    } // listen to incoming event in the client


    res.status(201).json(messageToSend) // 201 mean resourse is created(send message back to the client)
    }catch(error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}
