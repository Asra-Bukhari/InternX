const jwt = require("jsonwebtoken");
const User = require("../models/User");

// In-memory token blacklist (tokens added here are rejected)
// Note: This resets if the server restarts. For production, use Redis or a DB collection.
const tokenBlacklist = new Set();

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Reject blacklisted (logged-out) tokens
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: "Unauthorized: Token has been invalidated. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password) to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = { protect, tokenBlacklist };
