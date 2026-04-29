const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");
const {
  submitReview,
  getUserReviews,
} = require("../controllers/reviewController");

router.get("/user/:id", getUserReviews); // Public/accessible to all

router.use(protect);
router.use(requireVerifiedStudent); // Block unverified students from posting reviews

router.post("/", submitReview);

module.exports = router;
