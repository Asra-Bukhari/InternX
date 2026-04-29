const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");
const {
  sendCode,
  verifyEmail,
  uploadStudentCard,
} = require("../controllers/verificationController");

// All these routes are for students
router.use(protect);
router.use(restrictTo("student"));

router.post("/send-code", sendCode);
router.post("/verify-email", verifyEmail);
router.post("/upload-student-card", uploadStudentCard);

module.exports = router;
