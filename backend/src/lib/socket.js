import {Server} from "socket.io"
import http from "http" // we havn't installed it because it is built in to node
// A built-in Node.js module for creating an HTTP server.
import express from "express" //A web framework that simplifies handling HTTP requests and responses.


const app = express();
// create http server 
const server = http.createServer(app); //Converts your Express app into an HTTP server.

// create socket.io server
// Initializes Socket.io and configures CORS so the frontend can connect.
const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173"]
    }
})

// this will return the socketid when we pass userid 
export function getReceiverSocketId(userId){
    return userSocketMap[userId] // pass userId which will give us socketid 
}

 // implement online status as soon as user log in we should be able to send this event from server to client 
// store online user 
const userSocketMap = {} // format {userId : socketId} userId came from the database 
// as soon as user log in we will like to update here to know user just logged in
 
// listen for any incoming connections  (callback function)
io.on("connection", (socket)=>{ // socket is the user that has connected 
    console.log("A User connected ",socket.id)

    // first get the user id 
    const userId = socket.handshake.query.userId  // how can we pass this in the client 
    // if userId exist update userSocketMap
    if(userId) userSocketMap[userId] = socket.id

    // io.emit() is used to send events to all connected clients (broadcasting it to everyone)
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); // sending key

    // listen for disconnection
    socket.on("disconnect",() => {
        console.log("A User disconnected ",socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
}) 

export {io ,app, server};