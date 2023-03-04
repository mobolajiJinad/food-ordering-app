const express = require("express");
const { StatusCodes } = require("http-status-codes");

const { loginCtrller, signupCtrller } = require("../../controllers/auth/admin");

const router = express();

router.post("/signup", signupCtrller);

router.post("/login", loginCtrller);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      next(err);
    }
    res.status(StatusCodes.OK).json({ msg: "Log out successful" });
  });
});

module.exports = router;
