const express = require("express");

const app = express();
const connectDb = require("./config/database")
const User = require("./models/user")
app.use(express.json())

app.post("/signup", async(req,res)=>{
    const user = new User(req.body)
    
    
    try{
        await user.save();
        res.send("complete")
    }
    catch(err){
        res.status(400).send("some error found")
    }
   
});

app.get("/user",async(req,res)=> {
    const userEmail = req.body.email;
    try {
        const user = await User.findOne({email:userEmail})
        if(!user){
            res.status(404).send("usernot found")}
        else{
            res.send(user)
        }
    } catch (err) {
        res.status(400).send("somthing went worang")
    }
});

app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send("user not found")
        }
        else{
            res.send(users)
        }
    } catch (err) {
        res.status(400).send("somthing went worang")
    }
})


connectDb().then(() =>{
    console.log("connected");
    app.listen(3000,()=>{
        console.log("hello");
        
    });
    
}).catch((err)=>{
    console.log("not connected");
    
});

