import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    fullName:{
        type:String,
        required : false
    },
    phoneNumber:{
        type:String,
        required : false
    },
    country:{
        type:String,
        required : false
    },
    gender:{
        type:String,
        required : false
    },
    profileImage:{
        type:String,
        required : false
    },
    email:{
        type : String,
        unique: true, 
        required : true
    },
    username:{
        type:String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
     // Added Fields
     //isPrivate: { 
        //type: Boolean, 
        //default: false }, // Public (false) or Private (true) account
     //blockedUsers: [{
         //type: mongoose.Schema.Types.ObjectId, 
         //ref: "User" 
        //}], // List of blocked users
     //closeFriends: [{ 
        //type: mongoose.Schema.Types.ObjectId,
         //ref: "User" 
        //}],
        //linkedAccounts: [{ 
            //type: mongoose.Schema.Types.ObjectId, 
            //ref: "User" }], 
   },
{ timestamps: true }
)


export default mongoose.model("User",userSchema)