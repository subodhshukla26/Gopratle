const mongoose = require("mongoose");

const { mongoUri } = require("./env");

const connectDatabase = async () => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(mongoUri);

  console.log("MongoDB connected successfully");
};

module.exports = connectDatabase;