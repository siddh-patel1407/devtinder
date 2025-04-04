 const mongoose = require ( "mongoose");

 const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
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
        trim : true
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
        default : "https://tse3.mm.bing.net/th?id=OIP.q31nJQnuNTC0-rP-9hEnlwHaES&pid=Api&P=0&h=180"
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