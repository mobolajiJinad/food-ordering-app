const express = require("express");
const passport = require("passport");

const {
  googleCallbackCtrller,
  loginLocalCtrller,
  signUpLocalContrller,
} = require("../../controllers/auth/user");

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
    failureRedirect: "auth/user/login",
  }),
  googleCallbackCtrller
);

router.post("/login", loginLocalCtrller);

router.post("/signup", signUpLocalContrller);

// Export the router
module.exports = router;
