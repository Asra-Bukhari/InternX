const Message = require("../models/Message");
const Project = require("../models/Project");
const { createInternalNotification } = require("./notificationController");

// @desc    Send message inside a project chat room
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { projectId, receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!projectId || !receiverId || !content) {
      return res.status(400).json({ message: "projectId, receiverId, and content are required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the project has been assigned to a student
    if (!project.selectedStudent) {
      return res.status(403).json({ message: "Chat is restricted. Project is not assigned yet." });
    }

    const businessIdStr = project.businessId.toString();
    const selectedStudentStr = project.selectedStudent.toString();

    // Verify sender is part of this project chat
    if (senderId !== businessIdStr && senderId !== selectedStudentStr) {
      return res.status(403).json({ message: "You are not authorized to send messages in this project." });
    }

    // Verify receiver is part of this project chat
    if (receiverId !== businessIdStr && receiverId !== selectedStudentStr) {
      return res.status(403).json({ message: "Receiver is not authorized to receive messages in this project." });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      projectId,
      message: content,
    });

    await newMessage.save();

    // Create notification for the receiver
    await createInternalNotification({
      userId: receiverId,
      title: "New Message",
      message: `You have a new message regarding project: ${project.title}`,
      type: "message",
      relatedProjectId: projectId,
    });

    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get full chat history for one project
// @route   GET /api/messages/:projectId
// @access  Private
exports.getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const businessIdStr = project.businessId.toString();
    
    // selectedStudent could be null
    const selectedStudentStr = project.selectedStudent ? project.selectedStudent.toString() : null;

    if (userId !== businessIdStr && userId !== selectedStudentStr) {
      return res.status(403).json({ message: "You are not authorized to view messages for this project." });
    }

    const messages = await Message.find({ projectId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.status(200).json(messages);
  } catch (error) {
    console.error("getProjectMessages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all chats/messages of logged-in user
// @route   GET /api/messages/me
// @access  Private
exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .populate("projectId", "title");

    res.status(200).json(messages);
  } catch (error) {
    console.error("getMyChats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
