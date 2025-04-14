const express = require("express");
const validator = require("validator");
const cookieparser = require("cookie-parser");
const app = express();
const connectDb = require("./config/database");
const jwt = require("jsonwebtoken");
// const { userAuth } = require("./midelware/midelware");
const authRouter = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestsRoute = require("./routes/requests");
const userInfo = require("./routes/userInfo")

app.use(express.json());
app.use(cookieparser());

app.use("/",authRouter);
app.use("/",profileRoute);
app.use("/",requestsRoute);
app.use("/",userInfo);

connectDb()
  .then(() => {
    console.log("connected");
    app.listen(3000, () => {
      console.log("hello");
    });
  })
  .catch((err) => {
    console.log("not connected");
  });
