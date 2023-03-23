import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  settings: {
    displayRecentTemplates: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model("UserSettings", dataSchema);
