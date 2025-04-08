// Schema defines the structure of the data in MongoDB.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password : {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String, // it is not necessary required
            default: "", // once they upload profile pic we will update this value
        },
    }, 
            // for that createdAt and updatedAt we can add in second object time stamp of true to add those field so we can show membersince ....
            { timestamps: true}
);

const User = mongoose.model("User", userSchema); // mongoose specifically want to put the naming convention as sigular and first character uppercase

export default User;