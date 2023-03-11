const express = require("express");
const { StatusCodes } = require("http-status-codes");

const {
  logoutLocalCtrller,
  changePasswordCtrller,
  getAllFoods,
  placeFoodOrder,
  reviewOrder,
} = require("../../controllers/protected/user");

const router = express.Router();

// To get all Foods available for order
router.get("/foods", getAllFoods);

// To place a new order
router.post("/foods/:foodId/order", placeFoodOrder);

// To make users rate an ordered food
router.post("/foods/:foodId/rate", reviewOrder);

// To log user out
router.get("/settings/account/logout", logoutLocalCtrller);

// To change password
router.put("/settings/account/change-password", changePasswordCtrller);

module.exports = router;
