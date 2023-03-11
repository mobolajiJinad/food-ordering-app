const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

const Food = require("../../models/Food");
const Order = require("../../models/Order");

const uploadFood = async (req, res, next) => {
  try {
    const { name, description, price, quantity } = req.body;

    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Image upload is required" });
    }

    const createdBy = req.user._id;

    const food = await new Food({
      name,
      description,
      price,
      quantity,
      image: req.file.path,
      createdBy,
    }).save();

    const { _id } = food;
    res.status(StatusCodes.CREATED).json({
      msg: "Food created successfully",
      createdFood: { _id, name, description, price, quantity },
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    // find the Food by ID and check if it exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Food not found" });
    }

    // check if the current admin is the owner of the Food
    if (food.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You are not authorized to delete this Food" });
    }

    // Delete the image associated with the Food
    fs.unlink(food.image, (err) => {
      if (err) {
        console.log(err);
      }
    });

    await Food.deleteOne({ _id: food._id });
    res.status(StatusCodes.OK).json({ msg: "Food deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({ createdBy: req.user._id }).select(
      "-orders"
    );
    res.status(StatusCodes.OK).json({ foods });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const getOrders = async (req, res, next) => {
  try {
    const createdBy = req.user._id;

    // Get orders where the food belongs to the admin
    const orders = await Order.find().populate("userId").populate("foodId");
    // .where("food.adminId")
    // .equals(createdBy);

    res.status(StatusCodes.OK).json(orders);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  uploadFood,
  deleteFood,
  getFoods,
  getOrders,
};
