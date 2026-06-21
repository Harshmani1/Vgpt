import mongoose from "mongoose";
import {v1 as uuidv1} from 'uuid';


const MessageSchema = new mongoose.Schema({
    role :{
       type : String,
       enum : ["user", "assistant"],
       required : true,

    },
    content : {
        type : String,
        required : false
    },
    timestamp : {
        type : Date,
        default : Date.now
    }
})

const ThreadSchema = new mongoose.Schema({
    threadId: { type: String, unique: true, default: uuidv1()  }, // use your UUID here
    title: {
  type: String,
  default: "New Chat"
},
    
    messages: [MessageSchema],
    },{ timestamps: true });


const Thread = mongoose.model("Thread", ThreadSchema);

export default Thread;
