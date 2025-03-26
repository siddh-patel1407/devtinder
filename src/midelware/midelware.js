const admin = (req,res,next)=>{
    const name = "xyzui"
    const admin = name==="xyz";
    if(!admin){
        res.status(401).send("admin not aythorize")
    }
else{
    next();
}
}

module.exports = {admin}