const { StatusCodes } = require("http-status-codes");

const requireUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ msg: "You need to authenticate to access this resource" });
};

const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    req.user = req.session.user;
    next();
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "You need to authenticate to access this resource" });
  }
};

module.exports = { requireUser, requireAdmin };
