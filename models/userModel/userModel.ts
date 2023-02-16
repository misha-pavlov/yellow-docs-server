const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  age: {
    required: true,
    type: Number,
  },
});

// for fix Cannot redeclare block-scoped variable 'mongoose'.
export {}

module.exports = mongoose.model("User", dataSchema);
