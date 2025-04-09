 const mongoose = require ( "mongoose");
 const validator = require("validator")

 const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        // required : true,
        minLength: 3,
        maxLength: 40,
    },
    lastName : {
        type:String,
        
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid enail" + value)
            }
        }
    },
    age : {
        type : Number,
        required : true,
        min:18
    },
    password:{
        type:String,
        required : true,
        minLength: 6,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("not valid password" + value)
            }
        }
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender not match")
            }
        }
    },
    photoUrl : {
        type : String,
        default : "https://tse3.mm.bing.net/th?id=OIP.q31nJQnuNTC0-rP-9hEnlwHaES&pid=Api&P=0&h=180",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("not valid password" + value)
            }
        }
    },
    about : {
        type : String ,
        default : "aboput me for something"   
    },
    skill : {
       type : [String],
    }
 },{
    timestamps : true,
 });

 const User = mongoose.model("User",userSchema);

 module.exports = User