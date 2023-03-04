const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "This is a user protected route" });
});

module.exports = router;
