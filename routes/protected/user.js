const express = require("express");
const { StatusCodes } = require("http-status-codes");

const Product = require("../../models/Products");

const router = express.Router();

router.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find().populate("createdBy", "username");
    res.status(StatusCodes.OK).json(products);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

module.exports = router;
