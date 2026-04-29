const Payment = require("../models/Payment");
const Project = require("../models/Project");
const Deliverable = require("../models/Deliverable");

// @desc    Create payment record when student is selected
// @route   POST /api/payments
// @access  Private (Business)
exports.createPayment = async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    
    if (!projectId || !amount) {
      return res.status(400).json({ message: "projectId and amount are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.businessId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to create payment for this project" });
    }

    if (!project.selectedStudent) {
      return res.status(400).json({ message: "Cannot create payment: Project is not assigned to any student yet" });
    }

    const existingPayment = await Payment.findOne({ projectId });
    if (existingPayment) {
      return res.status(400).json({ message: "Payment record already exists for this project" });
    }

    const newPayment = new Payment({
      projectId,
      businessId: req.user.id,
      studentId: project.selectedStudent,
      amount,
      status: "pending",
    });

    await newPayment.save();

    res.status(201).json({ message: "Payment record created", payment: newPayment });
  } catch (error) {
    console.error("createPayment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get logged-in user payments
// @route   GET /api/payments/me
// @access  Private
exports.getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({
      $or: [{ businessId: userId }, { studentId: userId }],
    }).populate("projectId", "title status");

    res.status(200).json(payments);
  } catch (error) {
    console.error("getMyPayments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Business manually marks payment as completed
// @route   PATCH /api/payments/:id/complete
// @access  Private (Business)
exports.completePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.businessId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (payment.status === "paid") {
      return res.status(400).json({ message: "Payment is already completed" });
    }

    // Deliverables must be submitted before payment completion
    // We strictly check if there is AT LEAST one deliverable AND all are approved.
    const deliverables = await Deliverable.find({ projectId: payment.projectId });
    if (deliverables.length === 0) {
      return res.status(400).json({ message: "Cannot complete payment: No deliverables submitted yet" });
    }

    const unapprovedDeliverables = deliverables.filter(d => d.status !== "approved");
    if (unapprovedDeliverables.length > 0) {
      return res.status(400).json({ message: "Cannot complete payment: Not all deliverables are approved" });
    }

    // Complete payment
    payment.status = "paid";
    await payment.save();

    // Payment should control project completion lifecycle
    const project = await Project.findById(payment.projectId);
    project.status = "completed";
    await project.save();

    res.status(200).json({ message: "Payment completed successfully. Project is now complete.", payment });

    // Notify Student
    const { createInternalNotification } = require("./notificationController");
    await createInternalNotification({
      userId: payment.studentId,
      title: "Payment Received",
      message: `Payment for project '${project.title}' has been completed.`,
      type: "payment_completion",
      relatedProjectId: project._id,
    });
  } catch (error) {
    console.error("completePayment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
