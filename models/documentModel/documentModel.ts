import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  changedBy: {
    required: true,
    type: String,
  },
  changedAt: {
    required: true,
    type: Date,
  },
  owner: {
    required: true,
    type: String,
  },
  visibleFor: {
    require: true,
    type: [String],
  },
  favouriteInUsers: {
    type: [String],
    default: [],
  },
  content: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Document", dataSchema);
