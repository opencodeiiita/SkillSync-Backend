import User from "../models/User.js";


export const loginController = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ result: false, error: "email or password is missing" ,message: "email and password are required" });
    }

    const user = User.findOne({ email });
    if(!user){ 
        return res.status(400).json({ result: false, error: "user not found in the database" ,message: "user not found, please register first" });
    }



    if(!user.comparePassword(password)){
        return res.status(400).json({ result: false, error: "password is incorrect" ,message: "incorrect password" });
    }

    const token = user.generateToken();
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ result: true, message: "user logged in successfully", token: token });


}
