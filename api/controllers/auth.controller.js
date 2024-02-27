import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { error } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, password, email } = req.body;
    const hashPassword = bcryptjs.hashSync(password, 10); 
    const newUser = new User({ username, password: hashPassword, email });

    try {
        await newUser.save();
        res.status(200).json({ message: 'New user created!' })
    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const validUser = await User.findOne({ email });
		if (!validUser) return next(error(404, 'User not found'));
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) return next(error(401, 'wrong credentials'));
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
		const { password: hashedPassword, ...rest } = validUser._doc;
		const expiryDate = new Date(Date.now() + 3600000); // 1 hour
		res
			.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};


export const google = async (req, res, next) => {
	const {email,photo,name} = req.body
	try {
		const user = await User.findOne({ email });
		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
			const { password: hashedPassword, ...rest } = user._doc
			const expiryDate = new Date(Date.now() + 3600000) //1 hour
			res
				.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
				.status(200)
				.json(user);
		} else {
			const generatedPassword = Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const newUser = new User({
				username:
					name.split(' ').join('').toLowerCase() +
					Math.floor(Math.random() * 10000).toString(),
				email: email,
				password: hashedPassword,
				profilePicture: photo,
			});

			await newUser.save();

			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

			const { password: hashedPassword2, ...rest } = newUser._doc;

			const expiryDate = new Date(Date.now() + 3600000); //1 hour
			res.cookie("access_token",token,{httpOnly:true,expires:expiryDate}).status(200).json(newUser);
		}
	} catch (error) {
		
	}
}

export const signout =  (req, res) => {
	 res.clearCookie('access_token').status(200).json({message:`SignOut Successful`})
}