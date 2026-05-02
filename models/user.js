import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    firstName : {
        type: String,
        required : true
    },
    lastName : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    role : {
        type: String,
        required: true,
        default: "user"
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    image : {
        type: String,
        default : "https://pbs.twimg.com/profile_images/1795917311620378625/Dnrm-QVf_400x400.jpg"
    }

})

const User = mongoose.model("User", userSchema);

export default User;