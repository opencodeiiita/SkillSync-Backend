import mongoose from "mongoose";
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
    portfolio: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true, match: [/^https?:\/\/.+/, "Invalid portfolio URL"] },
        description: { type: String, maxlength: [500, "Description cannot exceed 500 characters"] },
      },
    ], // array of portfolio items
  },
  {
    timestamps: true, 
  }
);


UserProfileSchema.index({ email: 1 }, { unique: true });
UserProfileSchema.index({ skills: 1 });
export default mongoose.model("UserProfile", UserProfileSchema);