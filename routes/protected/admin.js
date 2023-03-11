const express = require("express");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");

const {
  uploadFood,
  deleteFood,
  getFoods,
  getOrders,
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

const upload = multer({ storage: storage });

// To log admin out
router.get("/settings/account/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      next(err);
    }
    res.status(StatusCodes.OK).json({ msg: "Log out successful" });
  });
});

// To add a product up for sale
router.post("/food/upload", upload.single("image"), uploadFood);

//To view all products submitted
router.get("/foods", getFoods);

// DELETE request to delete a product
router.delete("/food/:foodId", deleteFood);

// To get all foods that have been ordered
router.get("/orders", getOrders);

module.exports = router;
