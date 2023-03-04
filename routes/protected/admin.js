const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "This is an admin protected route" });
});

module.exports = router;
