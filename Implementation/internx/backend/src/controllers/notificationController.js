const Notification = require("../models/Notification");

// @desc    Get all notifications of logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
      
    res.status(200).json(notifications);
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Internal system route to create notification
// @route   POST /api/notifications/create
// @access  Private
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedProjectId } = req.body;

    if (!userId || !title || !message || !type) {
      return res.status(400).json({ message: "userId, title, message, and type are required" });
    }

    const newNotification = new Notification({
      userId,
      title,
      message,
      type,
      relatedProjectId,
    });

    await newNotification.save();

    res.status(201).json({ message: "Notification created", notification: newNotification });
  } catch (error) {
    console.error("createNotification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Internal helper for other controllers
exports.createInternalNotification = async (data) => {
  try {
    const newNotification = new Notification(data);
    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.error("Internal Notification error:", error);
  }
};
