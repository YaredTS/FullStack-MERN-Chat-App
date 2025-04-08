// here we will like to create instance that we can use through out our application

import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
   // in the production we are not going to have the localhost only in development
  // we will like to send our cookies in every single request 
  withCredentials: true,  
  //If the backend requires login authentication, this setting ensures the session cookie is sent when making requests.
})


// axiosInstance.get("/users"); 
// Equivalent to: axios.get("http://localhost:5001/api/users")