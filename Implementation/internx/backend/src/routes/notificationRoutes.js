const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markAsRead,
  createNotification,
} = require("../controllers/notificationController");

router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.post("/create", createNotification);

module.exports = router;
