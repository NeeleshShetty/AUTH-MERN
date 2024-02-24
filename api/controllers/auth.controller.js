import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'

export const signup = async (req, res, next) => {
    const { username, password, email } = req.body;
    const hashPassword = bcryptjs.hashSync(password, 10); 
    const newUser = new User({ username, password: hashPassword, email });

    try {
        await newUser.save();
        res.status(200).json({ message: 'New user created!' })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}