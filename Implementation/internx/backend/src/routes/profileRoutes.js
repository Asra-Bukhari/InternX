const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

// GET /api/profile/me   → get logged-in user's profile
router.get("/me", protect, getProfile);

// PUT /api/profile/me   → create or update logged-in user's profile
router.put("/me", protect, updateProfile);

module.exports = router;
