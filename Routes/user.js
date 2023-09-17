import express from 'express';
import bcrypt from 'bcrypt';
import { User, generateJwtToken } from '../models/user.js';
import { Student } from '../models/student.js';

let router = express.Router();

//signup
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

//login
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

//all student
router.get("/allstudent", async(req,res)=>{
    try {
        
        const stud = await Student.find().populate("name")
        if (!stud) {
            return res.status(400).json({ message: "Data Unavailable" })
        }
        res.status(200).json({
            message: "Sucessfully got your data",
            data: stud
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})
//add student
router.post("/addstudent", async(req,res)=>{
    try {
        
        let stud= await new Student({
            name:req.body.name,
            batch:req.body.batch,
            gender:req.body.gender,
            qualification:req.body.qualification
        }).save();

        res.status(201).json({message:"Added Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

//edit student
router.put("/editstudent", async(req,res)=>{
    try {
        
        let id = req.body._id
        let student=await Student.findOne({_id:id});
        
        const updatestudent = await Student.findOneAndUpdate(
            { _id: id },
            { $set:{name:req.body.name,
                    batch:req.body.batch,
                    gender:req.body.gender,
                    qualification:req.body.qualification} }
        );
        
        res.status(201).json({message:"Logged in Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

//delete student
router.delete("/deletestudent", async(req,res)=>{
    try {
        let stud= await Student.findByIdAndDelete({_id:req.body.id})
        
        res.status(201).json({message:"Logged in Successfully",token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

export const userRouter= router;