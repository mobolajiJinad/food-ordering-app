const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const User = require("../../models/User");
const Food = require("../../models/Food");
const Order = require("../../models/Order");

const logoutLocalCtrller = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.status(StatusCodes.OK).json({ msg: "Log out successful" });
  });
};

const changePasswordCtrller = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: req.user._id });

    // Verify that the user's current password matches their stored password in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Incorrect current password." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password in the database
    await User.updateOne(
      { _id: req.user._id },
      { password: hashedNewPassword }
    );

    res.status(StatusCodes.OK).json({ msg: "Password successfully changed." });
  } catch (err) {
    next(err);
  }
};

const placeFoodOrder = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;
    const createdBy = req.user._id;
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Food not found" });
    }
    const totalAmount = food.price * quantity;
    const order = await Order.create({
      userId: req.user._id,
      foodId: foodId,
      adminId: food.createdBy,
      quantity,
      createdBy,
      totalAmount,
    });

    if (order.quantity > food.quantity) {
      res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: "Out of stock." });
    }

    food.quantity -= order.quantity;
    food.orders.push(order._id);
    await food.save();
    res.status(StatusCodes.CREATED).json(order);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const getAllFoods = async (req, res, next) => {
  try {
    const food = await Food.find()
      .select("-orders")
      .populate("createdBy", "username");
    res.status(StatusCodes.OK).json(food);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const reviewOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      userId: req.user._id,
      foodId: req.params.foodId,
    }).exec();

    if (!order) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "You cannot rate this item as you have not ordered it." });
      return;
    }

    const existingRating = order.ratings.find(
      (rating) => rating.userId.toString() === req.user._id.toString()
    );
    if (existingRating) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You have already rated this item." });
      return;
    }

    const { rating, comment } = req.body;

    order.ratings.push({
      rating,
      comment,
    });

    await order.save();

    res.status(200).json({ message: "Thank you for rating this food item." });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  logoutLocalCtrller,
  changePasswordCtrller,
  placeFoodOrder,
  getAllFoods,
  reviewOrder,
};
