const express = require("express");

const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.json({ msg: "This is a protected route" });
});

module.exports = router;
