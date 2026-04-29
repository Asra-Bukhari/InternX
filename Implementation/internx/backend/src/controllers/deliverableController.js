const Deliverable = require("../models/Deliverable");
const Project = require("../models/Project");

// @desc    Student submits project deliverable
// @route   POST /api/deliverables
// @access  Private (Verified Student)
exports.submitDeliverable = async (req, res) => {
  try {
    const { projectId, fileUrl } = req.body;
    const studentId = req.user.id;

    if (!projectId || !fileUrl) {
      return res.status(400).json({ message: "projectId and fileUrl are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.selectedStudent && project.selectedStudent.toString() !== studentId) {
      return res.status(403).json({ message: "You are not assigned to this project" });
    }

    const newDeliverable = new Deliverable({
      projectId,
      studentId,
      fileUrl,
    });

    await newDeliverable.save();

    // Notify Business Owner
    const { createInternalNotification } = require("./notificationController");
    await createInternalNotification({
      userId: project.businessId,
      title: "New Deliverable Submitted",
      message: `A new deliverable has been submitted for project: ${project.title}`,
      type: "deliverable_submission",
      relatedProjectId: projectId,
    });

    res.status(201).json({ message: "Deliverable submitted successfully", deliverable: newDeliverable });
  } catch (error) {
    console.error("submitDeliverable error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Business views submitted deliverables
// @route   GET /api/deliverables/:projectId
// @access  Private (Business / Student involved)
exports.getProjectDeliverables = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const businessIdStr = project.businessId.toString();
    const selectedStudentStr = project.selectedStudent ? project.selectedStudent.toString() : null;

    if (req.user.id !== businessIdStr && req.user.id !== selectedStudentStr) {
      return res.status(403).json({ message: "You are not authorized to view these deliverables" });
    }

    const deliverables = await Deliverable.find({ projectId }).sort({ submittedAt: -1 });
    res.status(200).json(deliverables);
  } catch (error) {
    console.error("getProjectDeliverables error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Business approves deliverable
// @route   PATCH /api/deliverables/:id/approve
// @access  Private (Business only)
exports.approveDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findById(req.params.id).populate("projectId");
    
    if (!deliverable) {
      return res.status(404).json({ message: "Deliverable not found" });
    }

    if (deliverable.projectId.businessId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the project business owner can approve this" });
    }

    deliverable.status = "approved";
    await deliverable.save();

    // Notify Student
    const { createInternalNotification } = require("./notificationController");
    await createInternalNotification({
      userId: deliverable.studentId,
      title: "Deliverable Approved",
      message: `Your deliverable for project '${deliverable.projectId.title}' has been approved.`,
      type: "deliverable_approval",
      relatedProjectId: deliverable.projectId._id,
    });

    res.status(200).json({ message: "Deliverable approved", deliverable });
  } catch (error) {
    console.error("approveDeliverable error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
