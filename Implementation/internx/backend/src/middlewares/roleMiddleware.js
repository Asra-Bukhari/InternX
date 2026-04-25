// Middleware to restrict access based on user role
// Usage: restrictTo("business") or restrictTo("admin", "business")
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Only ${roles.join(" or ")} accounts can perform this action`,
      });
    }
    next();
  };
};

module.exports = { restrictTo };
