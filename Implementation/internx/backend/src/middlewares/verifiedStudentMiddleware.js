// Middleware to block unverified students
const requireVerifiedStudent = (req, res, next) => {
  if (req.user && req.user.role === "student" && !req.user.isVerified) {
    return res.status(403).json({
      message: "Verification required before accessing platform features",
    });
  }
  next();
};

module.exports = { requireVerifiedStudent };
