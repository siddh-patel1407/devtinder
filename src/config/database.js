const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://sspatel140706:slVd1XHxD6HewJi0@nodejs.dl0b1.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
