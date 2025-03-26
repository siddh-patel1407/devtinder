const express = require ("express");
const { admin } = require("./midelware/midelware");

const app = express();

app.use("/admin",admin)

app.get("/admin/getalldata",(req,res)=>{
    res.send("data is lodaed")
});

app.get("/admin/deletdata",(req,res)=>{
    res.send("data is gone")
});