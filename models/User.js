const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  // add any other relevant fields
});

function comparePassword(inputedPassword) {
  return bcrypt.compare(inputedPassword, this.password);
}

userSchema.methods.comparePassword = comparePassword;
const User = mongoose.model("User", userSchema);

module.exports = User;
