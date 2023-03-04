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
    minlength: 7,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
});

function comparePassword(inputedPassword) {
  return bcrypt.compare(inputedPassword, this.password);
}

userSchema.methods.comparePassword = comparePassword;
const User = mongoose.model("User", userSchema);

module.exports = User;
