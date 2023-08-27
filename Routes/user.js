import express from 'express';
import bcrypt from 'bcrypt';
import { User, generateJwtToken } from '../models/user.js';

let router = express.Router();

router.post("/signup", async(req,res)=>{
    try {
        //Find user is already available
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).json({message:"Email already exist"})

        //generate hashed password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.body.password,salt);

        //new user updation
        user= await new User({
            name:req.body.name,
            email:req.body.email,
            contact:req.body.contact,
            password:hashedPassword
        }).save();
        //generating token
        let token = generateJwtToken(user._id);
        res.status(201).json({message:"SignUp Successfully",token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

router.post("/login", async(req,res)=>{
    try {
        //Find user is available
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"})

        //Validate password
        let validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!validatePassword) return res.status(400).json({message:"Invalid Credentials"})
        //generating token
        let token = generateJwtToken(user._id);
        res.status(201).json({message:"Logged in Successfully",token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

export const userRouter= router;