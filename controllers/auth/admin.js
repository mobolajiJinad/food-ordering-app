const { StatusCodes } = require("http-status-codes");

const Admin = require("../../models/Admin");

const loginCtrller = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });
    if (!user) {
      res.status(401).json({ msg: "Invalid username or password" });
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ msg: "Invalid email or password" });
      } else {
        req.session.user = user; // store user in session
        res.status(200).json({ msg: "Login successful" });
      }
    }
  } catch (err) {
    next(err);
  }
};

const signupCtrller = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new Admin({ username, password });
    await user.save();
    req.session.user = user; // store user in session
    res.status(StatusCodes.CREATED).json({ msg: "User created" });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginCtrller, signupCtrller };
