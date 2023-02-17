import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("User", dataSchema);
