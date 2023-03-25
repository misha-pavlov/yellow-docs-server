import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    required: true,
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Templates", dataSchema);
