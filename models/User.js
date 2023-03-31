// data model for the current user

//CHANGE THIS
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
  },

  book: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
