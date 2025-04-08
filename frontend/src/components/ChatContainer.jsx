import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
        messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages,
        } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id); // get messages between us and the selected user 
    // because getMessage setter function expects userid to send it in the endpoint
    subscribeToMessages();
    return () => unsubscribeFromMessages(); // when ever we clean up
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
  // when ever the selecteduser id changes run the useEffect 

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // loading state(output that we will have while the messages are loading)
  if (isMessagesLoading) { // if you want to see it set if(true) 
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  // if we try to add useEffect below the if check it will warn you 

  return (
    // lets return three different components (three components)
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => ( //get every single message 
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            // if we are sender of the message we will have this class (chat-end) if the other start user send the 
            // message then it will start from the left hand side
            ref={messageEndRef}
          >
{/* This are from daisy ui component called (chat bubble )looks like chat component */}

            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />

              </div>
            </div>

            {/* Render the time of the message */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Chat Bubble */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;