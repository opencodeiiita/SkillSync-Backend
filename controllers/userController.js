import User from "../models/User.js";

// Update user profile route handler
export async function updateUserProfile(req, res) {
  try {
    const userId = req.params.id; 
    const updates = req.body; 

    const updateFields = {};

    if (updates.skills) {
      updateFields.skills = updates.skills;
    }

    if (updates.bio) {
      updateFields.bio = updates.bio;
    }

    if (updates.profilePicture) {
      updateFields.profilePicture = updates.profilePicture;
    }

    if (updates.portfolio) {
      updateFields.portfolio = updates.portfolio;
    }

    // Handle adding/removing skills separately
    if (updates.addSkill || updates.removeSkill) {
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (updates.addSkill) {
        if (!user.skills.includes(updates.addSkill)) {
          updateFields.skills = [...user.skills, updates.addSkill];
        }
      }

      if (updates.removeSkill) {
        updateFields.skills = user.skills.filter(skill => skill !== updates.removeSkill);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the updated user as the response
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }

export async function handleCreateuser(req,res){
    try {
        const user = req.body;
        if(!user.name){
            return res.json({error:"Name is required"});
        }
        if(user.name.length < 2){
            return res.json({error:"Name must be at least 2 characters long"});
        }
        if(!user.email){
            return res.json({error:"Email is required"});
        }
        if(!user.skills || user.skills.length === 0 ){
        return res.json({error:"At least one skill is required"});
        }
        if(!user.profilePicture){
            user.profilePicture = "https://avatar.iran.liara.run/public/boy?username=Ash";
        }
        const newUser = new UserProfile(user);
        await newUser.save();
        return res.json({message:"User created successfully",user:newUser});
    } catch (error) {
        return res.json({error:"Error creating user" + error.message});
    }
}
