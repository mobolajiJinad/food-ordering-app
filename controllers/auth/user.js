const passport = require("passport");
const { StatusCodes } = require("http-status-codes");

const User = require("../../models/User");
const genPassword = require("../../middleware/generatePassword");

const googleCallbackCtrller = (err, req, res, next) => {
  if (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Failed to authenticate with Google" });
  }
  res.status(StatusCodes.OK).json({ msg: "Login successful" });
};

const loginLocalCtrller = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(StatusCodes.OK).json({ msg: "Login successful" });
    });
  })(req, res, next);
};

const logoutLocalCtrller = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.status(StatusCodes.OK).json({ msg: "Log out successful" });
  });
};

const signUpLocalContrller = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Provide both username and password" });
    }

    const hashedPassword = await genPassword(password);

    const newUser = new User({ username, email, password: hashedPassword });

    const savedUser = await newUser.save();

    // Send a success response
    res
      .status(StatusCodes.OK)
      .json({ msg: "Signup successful!", user: savedUser });
  } catch (err) {
    // Handle errors
    next(err);
  }
};

module.exports = {
  googleCallbackCtrller,
  loginLocalCtrller,
  logoutLocalCtrller,
  signUpLocalContrller,
};
