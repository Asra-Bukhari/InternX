const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");
const { adminVerifyStudent } = require("../controllers/verificationController");

router.use(protect);
router.use(restrictTo("admin"));

// PATCH /api/admin/verify-student/:userId
router.patch("/verify-student/:userId", adminVerifyStudent);

module.exports = router;
