<<<<<<< HEAD
const mongoose = require('mongoose');

/* Fields:
FIELD	        TYPE	        REQUIRED	    DESCRIPTION
name	        String	        Yes	            Full name of the user (min. 2 characters).
email	        String	        Yes	            Unique email address. Must be a valid email format.
skills	        Array[String]	Yes	            List of skills (e.g., "JavaScript", "Design"), atleast one must be provided.
bio	            String	        No	            Short biography (max. 500 characters).
profilePicture	String (URL)	No	            URL to the profile picture (image formats only).
portfolio	    String (URL)	No	            URL to the user's portfolio website.
timestamps	    Auto	        N/A	            Automatically generated createdAt and updatedAt.
*/

/*Indexes:
email:  Unique index for fast email lookups.
skills: Indexed for quick querying of users by their skills.
 */

// Sample user data
/*const sampleUser = new UserProfile({
    name: "John Doe",
    email: "john.doe@example.com",
    skills: ["JavaScript", "React", "Node.js"],
    bio: "Full Stack Developer with a passion for building web applications.",
    profilePicture: "https://example.com/john-doe.jpg",
    portfolio: "https://johndoe.dev",
  });*/

const UserProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    skills: {
      type: [String], 
      validate: {
        validator: function (v) {
          return v.length > 0; // At least one skill must be provided
        },
        message: "At least one skill is required",
      },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    profilePicture: {
      type: String, // URL to the profile picture
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/, "Invalid image URL"],
    },
    portfolio: {
      type: String, 
      match: [/^https?:\/\/.+/, "Invalid portfolio URL"],
    },
  },
  {
    timestamps: true, 
  }
);


UserProfileSchema.index({ email: 1 }, { unique: true });
UserProfileSchema.index({ skills: 1 });

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

module.exports = UserProfile;
=======
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true,
        maxlength: [100, 'Full Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    }
}, {
    timestamps: true //Change this if not required
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(8); // you can increase the salt rounds but that will slow the the hashing process
        this.password = await bcrypt.hash(this.password, salt); 
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model('User', userSchema);
>>>>>>> upstream/main
