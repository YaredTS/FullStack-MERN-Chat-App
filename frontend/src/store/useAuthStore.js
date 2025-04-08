// here we can have bunch of different state and function we can use in d/f components
// lets say we are going to need state for authenticated user 
import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

import {io} from "socket.io-client"

const BASE_URL =  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

//   take the first argument as callback function where we like to return object
// {} this object would be our initial state
// set is the setter function that we will be using 
export const useAuthStore = create((set,get) => ({
    //initially the authuser would be zero b/c we don't know if user is authenticated or not
    authUser: null,
        // loading state
        isSigningUp: false, // state to create loading instead of create account it will display loading icon
        isLoggingIn: false,
        isUpdatingProfile: false,
    // we might want to have loading state for this , initially it will be true because as soon us we refresh the page we will start to check if this user is authenticated 
    isCheckingAuth: true,  // when refreshing while it is checking we can display loading spinner

    socket: null, // state for the socket 

// we are calling this function whenever we refresh our app that was set on the app.jsx(when our app start)
    checkAuth: async() => {
        try{ //send request to our endpoint 
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket(); 
        }
        catch(error){
            console.log("Error in checkAuth:",error?.response?.data || error.message)
            set({authUser:null})
        }finally {
            set({isCheckingAuth:false})
        }
    },

    signup: async(data) => {
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created successfully")
            get().connectSocket(); 
        }catch(error){
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.log("Error in signup:", error);
        }finally {
            set({isSigningUp: false})
        }
    },


    // we will implement socket.io in the login because as soon as user login we want to create connection
    // whenever we login we want to connect to socket immediately 
    login: async(data) => {
        set({isLoggingIn: true})
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged in Successfully");
// get call this method called connectSocket but we must create this method 
            get().connectSocket();  // with the help of this get method in callback we can access to different state and function in a specific function 
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Something went wrong");
        }finally{ 
            set({isLoggingIn: false})
        }
    },

//  before building login page we will build the logout functionality so we can logout and visit login page 
// we can add (isloggingout) state but since it is super quick we don't need it if you want we can set it up
    logout: async() => {
        try{
            axiosInstance.post("auth/logout");
            set({authUser: null})
            toast.success("Logged Out Successfully")
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message)
        }
    } ,

    updateProfile: async(data) => {
        set({isUpdatingProfile: true})
        try{
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser: res.data})
            toast.success("Profile Updated Successfully");
        }catch(error){
            console.log("error in update profile:". error)
            set({ error: error.response?.data?.message || "Failed to load users" });
            toast.error(error?.response?.data?.message || "Something went wrong");
        }finally{
            set({isUpdatingProfile: false});
        } 
    },

    connectSocket: async() => {
        // if user is not authenticated don't try to even create the connection 
        const {authUser} = get() // destructuring 
        if(!authUser || get().socket?.connected) return; // if there is no auth user return from this function before even try to connect 
        // further optimization if we are already connected don't try to create new connection 
        // const socket = io ("http://localhost:5001") or
        const socket = io (BASE_URL, {
            query: {
                userId: authUser._id,
            }
        })   
        socket.connect()
        set({socket: socket})// set it up with state 

        // listen to the event (listen to the online user updates) as soon as we are logged in 
        // we are getting the userIds as the data and updating the onlineUsers state
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers : userIds})
        })

    },

    disconnectSocket: async() => {
        // optimization if - if you are connected only then try to disconnect 
        if(get().socket?.connected) {get().socket.disconnect()};
    }

}));



