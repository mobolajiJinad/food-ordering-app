const errorHandler = (err, req, res, next) => {
  // Check if the error is a known error
  if (err.status) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    // Log the error for debugging purposes
    console.error(err);

    // Send a generic error message to the client
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = errorHandler;
