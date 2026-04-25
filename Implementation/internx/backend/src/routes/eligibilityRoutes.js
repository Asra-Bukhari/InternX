const express = require("express");
const router = express.Router();
const { checkEligibility } = require("../controllers/eligibilityController");
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");

// GET /api/eligibility/check/:projectId  → Private (student only)
router.get("/check/:projectId", protect, restrictTo("student"), checkEligibility);

module.exports = router;
