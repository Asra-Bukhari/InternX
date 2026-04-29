const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  sendMessage,
  getProjectMessages,
  getMyChats,
} = require("../controllers/messageController");
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");

router.use(protect);
router.use(requireVerifiedStudent);

router.get("/me", getMyChats);
router.get("/:projectId", getProjectMessages);
router.post("/", sendMessage);

module.exports = router;
