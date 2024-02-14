const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

async function connectToDb(uri) {
  try {
    await mongoose.connect(uri);
    return console.log("connected to MongdoDB");
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
    process.exit(1); // exit on error
  }
}

module.exports = connectToDb;
