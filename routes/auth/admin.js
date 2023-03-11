const express = require("express");
const { StatusCodes } = require("http-status-codes");

const { loginCtrller, signupCtrller } = require("../../controllers/auth/admin");

const router = express();

router.post("/signup", signupCtrller);

router.post("/login", loginCtrller);

module.exports = router;
