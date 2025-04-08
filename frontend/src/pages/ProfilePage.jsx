import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
 
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; //to read the image that the user selected we grab it as a file first element
    if (!file) return; // if no file don't do anything just return out of the file

    const reader = new FileReader(); // Create a FileReader instance (allows reading file data)
                                     // FileReader is a built-in JavaScript API that reads files.
    reader.readAsDataURL(file);  
    // This starts reading the file and converts it into a Base64 encoded string.
    // The reading happens asynchronously, meaning the next code lines won’t wait for this to finish.
    reader.onload = async () => {
      const base64Image = reader.result; 
      // The onload event triggers after the file has been completely read.
      //  reader.result now holds the Base64 string representation of the file.
      setSelectedImg(base64Image); // Update state with the selected image
      await updateProfile({ profilePic: base64Image }); // Send the base64 image to updateProfile function
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-300">
      <div className="max-w-2xl mx-auto p-4 py-8">

        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
{/* the input is hidden because when we click the icon (camera) behind the seen the input is clicked how it work is the camera icon and the input is in the same label and when we select image the onchange function will run */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*" // Restricts selection to only image files (.jpg, .png, .gif, etc.)
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  // if isUpdatingProfile is true the input icon will be disabled
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

{/* This are read only (if we want we can make adjustment so that user can change name and email by adding some adjustment to the backend) */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
              {/* ?. (optional chaining) → Ensures we access fullName only if authUser exists.
              If authUser is null/undefined → It prevents errors and returns undefined instead of crashing. */}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
                {/* createdAt is in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
                In an ISO 8601 datetime format, "T" is a separator that distinguishes the date from the time
                The optional chaining (?.) ensures that if authUser or createdAt is undefined or null, it won't throw an error. */}
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProfilePage;