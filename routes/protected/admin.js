const express = require("express");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");

const Product = require("../../models/Products");
const {
  uploadProduct,
  deleteProduct,
  getProducts,
} = require("../../controllers/protected/admin");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ dest: "uploads/" });

// To add a product up for sale
router.post("/product/upload", upload.single("image"), uploadProduct);

//To view all products submitted
router.get("/products", getProducts);

// DELETE request to delete a product
router.delete("/product/:productId", deleteProduct);

module.exports = router;
