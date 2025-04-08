// we will put everything that is related to chat into this store 
import {create} from 'zustand'
import toast from 'react-hot-toast'
import {axiosInstance} from '../lib/axios'
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set,get) => ({
    messages:[], // when ever we got new message we will update this in real time  (create function)
    users: [],
    selectedUser: null, //initially we will set it to null so that we can see placeholder component and when we select the user it will update the uI on the right side
    isUsersLoading: false, // when this is true we will see skeleton on the sidebar(loading state)
    isMessagesLoading: false, // loading state
    onlineUsers: [],

    error: null,  // <- Store error messages here

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: Array.isArray(res.data) ? res.data : [] }); 
        } catch (error) {
          toast.error(error.response.data.message);
          set({ users: [] }); // fallback
        } finally {
          set({ isUsersLoading: false });
        }
      }, 

      // we need to pass the userId so that we know which chat that we are trying to fetch
      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },
      
      // to send request to our api
      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get(); // we can use this getter comming from zustand doesn't mean the message and selectedUser state is from this file , call the get and destructure the state above 
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          // send message id to the api  
          // then we will get the response back which is gone be the updated message(newly created message)
          // so we will updated the state with it 
          set({ messages: [...messages, res.data] }); //keep the previous message an add the very lasyone to the end so that we can update the ui immediately
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

      subscribeToMessages: () => {
        const {selectedUser} = get()
        if(!selectedUser) return;
        // this socket is not in this store it in the useAuthStore (? How can we get this)
        const socket = useAuthStore.getState().socket; 
        // The event we were listening was newMessage
        socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          // if(newMessage.senderId !== selectedUser._id) return;
          if(!isMessageSentFromSelectedUser) return
          set({messages:[...get().messages, newMessage]})
        })
      },  // todo : optimize later

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket; 
        socket.off("newMessage")
      },

      // function to set the selected user with the clicked user 
      setSelectedUser: (selectedUser) => set({ selectedUser }),
}))