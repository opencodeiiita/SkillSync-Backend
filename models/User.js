import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


/* Fields:
FIELD	          TYPE	          REQUIRED	      DESCRIPTION
name	          String	        Yes	            Full name of the user (min. 2 characters).
email	          String	        Yes	            Unique email address. Must be a valid email format.
password        String          Yes             Password. Minimum 6 char length.
skills	        Array[String]	  Yes	            List of skills (e.g., "JavaScript", "Design"), atleast one must be provided.
bio	            String	        No	            Short biography (max. 500 characters).
profilePicture	String (URL)	  No	            URL to the profile picture (image formats only).
portfolio	      Array	          No	            URL to the user's portfolio website.
timestamps	    Auto	          N/A	            Automatically generated createdAt and updatedAt.
*/

/*Indexes:
  email:  Unique index for fast email lookups.
  skills: Indexed for quick querying of users by their skills.
*/

// Sample user data
/*const sampleUser = new User({
  name: "John Doe",
  password: "John123",
  email: "john.doe@example.com",
  skills: ["JavaScript", "React", "Node.js"],
  bio: "Full Stack Developer with a passion for building web applications.",
  profilePicture: "https://example.com/john-doe.jpg",
  portfolio:[
    {
      "title": "My Personal Blog",
      "url": "https://www.myblog.com",
      "description": "A blog where I share my personal projects and articles on technology."
    }
  ]
});*/
  
const UserSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && (v.length === 0 || v.every(skill => typeof skill === 'string')); // Allows empty array or an array of strings
        },
        message: "Skills must be an array of strings, and it can be empty",
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
    portfolio: [
      {
        title: { type: String },
        url: { type: String, match: [/^https?:\/\/.+/, "Invalid portfolio URL"] },
        description: { type: String, maxlength: [500, "Description cannot exceed 500 characters"] },
      },
    ], // array of portfolio items    
    sessionsEnrolled :[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    }],

  },
  {
    timestamps: true, 
  }
);

// UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ skills: 1 });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


UserSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const User = mongoose.model("User", UserSchema);

export default User;

