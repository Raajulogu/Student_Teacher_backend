import mongoose from 'mongoose';

let studentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            maxlength:30,
        },
        batch:{
            type:String,
            required:true,
        },
        gender:{
            type:String,
            required:true,
            trim:true,
        },
        qualification:{
            type:String,
            required:true,
        }
    }
)


let Student=mongoose.model("student",studentSchema);
export {Student}