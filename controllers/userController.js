const UserProfile = require('../models/UserProfile');
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
