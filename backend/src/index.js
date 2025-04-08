// const express = require("express")
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import path from "path";  // module built in node like http server 

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {app,server} from "./lib/socket.js"

import { connectDB } from "./lib/db.js";
 
// const app = express(); delete this cuz we already created it on socket.jsfile 

dotenv.config() // function to access the enviromental variable

const PORT = process.env.PORT // this is calling port from the enviromental variable

const __dirname = path.resolve();
 
app.use(express.json()) // allow you to extract  json data out of body
app.use(cookieParser()) // this will allow you to parse the cookie
app.use(cors({
    origin: "http://localhost:5173", // Allows requests only from this origin
    credentials: true // allow the cookies or auth header to be sent with the request 
}))
// A CORS (Cross-Origin Resource Sharing) error happens when a web page from one origin (domain) tries to request resources (like an API) from a different origin, but the server does not allow it.

app.use("/api/auth", authRoutes) // Any request to /api/auth should be handled by authRoutes
app.use("/api/messages", messageRoutes)

// if we are in a production make this dist in the frontend be our static asset
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

// if we visit any routes than these in the above routes send back index.html our react app
// Catches all GET requests that haven’t matched a static file (like /dashboard, /profile, etc.).
// Sends back the index.html file.
// Why? Because React Router (on the client side) handles the routing. So no matter what route the user visits, they get index.html, and React figures out which page to show.
    app.get("*" , (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
  });



// replace app with server
server.listen(PORT, () => { 
    console.log("server is running on port:" + PORT);
    connectDB() //data requests (e.g., CRUD operations).Create, Read, Update, and Delete
})
//specific entry point on your computer or server where the application will accept incoming HTTP requests.


// app.listen(PORT, () => {
//     console.log("server is running on port:" + PORT);
//     connectDB()
// })

// Your Express app runs an HTTP server that listens on a specified port (e.g., app.listen(3000, () => console.log("Server running..."))).

// When a client (browser, mobile app, or another service) makes a request, Express processes it.