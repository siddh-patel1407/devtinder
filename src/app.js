const express = require("express");

const app = express();


app.use( "/test",(req,res)=>{
    res.send("server responding")
    
});
app.use( "/",(req,res)=>{
    res.send("server responding from home page")
    
});
app.use( "/hello",(req,res)=>{
    res.send("server responding for hello")
    
});

app.listen(3000,()=>{
    console.log("hello");
    
});