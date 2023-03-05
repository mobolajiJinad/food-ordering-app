const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

const Product = require("../../models/Products");

const uploadProduct = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Image upload is required" });
    }

    const createdBy = req.user._id;

    const product = await new Product({
      name,
      description,
      price,
      image: req.file.path,
      createdBy,
    }).save();

    const { _id } = product;
    res.status(StatusCodes.CREATED).json({
      message: "Product created successfully",
      createdProduct: { _id, name, description, price },
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // find the product by ID and check if it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Product not found" });
    }

    // check if the current admin is the owner of the product
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You are not authorized to delete this product" });
    }

    // Delete the image associated with the product
    fs.unlink(product.image, (err) => {
      if (err) {
        console.log(err);
      }
    });

    await Product.deleteOne({ _id: product._id });
    res
      .status(StatusCodes.OK)
      .json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.session.user._id });
    res.status(StatusCodes.OK).json({ products });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  uploadProduct,
  deleteProduct,
  getProducts,
};
