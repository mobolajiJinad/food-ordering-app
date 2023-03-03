const express = require("express");
const passport = require("passport");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const genPassword = require("../middleware/generatePassword");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (err, req, res, next) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Failed to authenticate with Google" });
    }
    res.status(StatusCodes.OK).json({ msg: "Login successful" });
  }
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(StatusCodes.OK).json({ msg: "Login successful" });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.status(StatusCodes.OK).json({ msg: "Log out successful" });
  });
});

router.post("/signup", async (req, res, next) => {
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
});

// Export the router
module.exports = router;
