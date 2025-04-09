const validator = require("validator");

const validateSingUpData = (req) => {

const{firstName, lastName, email , password} = req.body;

if( !firstName || !lastName){
    throw new Error("name not valid")
}
else if(!validator.isEmail(email)){
    throw new Error("email is not valid")
}else if (!validator.isStrongPassword(password)){
    throw new Error("not a stong password")
}


}

module.exports = {
    validateSingUpData
}