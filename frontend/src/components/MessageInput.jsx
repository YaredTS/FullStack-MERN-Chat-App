// input to type messages and button to be able to send image and send button we can either press button to send of press enter 

import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState(""); // state to type message 
  const [imagePreview, setImagePreview] = useState(null); // to preview image 
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore(); // function to send the message call our endpoint

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // file that the user selects get the first one 
    if (!file.type.startsWith("image/")) { // if type of file is not image 
      // The startsWith() method checks if the MIME type of the file starts with the string image/. This is because image MIME types usually begin with image/ (e.g., image/png, image/jpeg)
      toast.error("Please select an image file");
      return;
    }
// if user set image we create file reader  and set the setimagepreview with it  
// onloadend waits for the file to be read (reader.readAsDataURL(file)) after that it will be executed 
// the order we put in is because Always attach event handlers before starting asynchronous operations.
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">

      {/* Preview Image */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Form to handle the input  */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file" //The <input> field is of type file, allowing the user to select an image file from their device.
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            //The ref={fileInputRef} assigns a reference to this input element, which allows you to access and trigger it programmatically (i.e., opening the file picker when the button is clicked).
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            //fileInputRef.current?.click() accesses the hidden file input through the ref and triggers the file selection dialog.
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;