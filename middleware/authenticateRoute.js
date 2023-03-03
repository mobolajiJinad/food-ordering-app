const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ msg: "You need to authenticate to access this resource" });
};

module.exports = requireAuth;
