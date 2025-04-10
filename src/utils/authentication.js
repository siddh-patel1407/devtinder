const validator = require("validator");

const validateSingUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  // if( !firstName || !lastName){
  //     throw new Error("name not valid")
  // }
  if (!validator.isEmail(email)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("not a stong password");
  }
};

const validateUpdate = (req) => {
  const validatefilde = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "about",
    "skill",
  ];

  const isUpdateAllow = Object.keys(req.body).every((k) =>
    validatefilde.includes(k)
  );

  return isUpdateAllow;
};

const validateUpdatepassword = (req) => {
  const validatefilde = ["password"];

  const isUpdateAllow = Object.keys(req.body).every((k) =>
    validatefilde.includes(k)
  );

  return isUpdateAllow;
};

module.exports = {
  validateSingUpData,
  validateUpdate,
  validateUpdatepassword,
};
