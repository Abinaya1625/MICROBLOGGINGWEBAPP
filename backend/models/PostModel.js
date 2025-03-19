import mongoose from "mongoose";

const postSchema = new mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", 
        required: true,
      },
    category:{
        type:String,
        required : true
    },
    description:{
        type:String,
        required : false
    },
    postImage:{
        type:String,
        required : true
    },
},
{ timestamps: true },
)


export default mongoose.model("Post", postSchema)