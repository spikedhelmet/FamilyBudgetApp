const config = require("./config/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const url = config.MONGODB_URI;

module.exports = async () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(url)
    .then(console.log("Connected to MongoDb"))
    .catch((error) => console.error(error));

  logger.info("App configured, ready to start");
};
