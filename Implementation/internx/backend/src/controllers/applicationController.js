const Application = require("../models/Application");
const Project = require("../models/Project");

// @desc    Apply for a project
// @route   POST /api/applications
// @access  Private (Verified Student)
exports.applyForProject = async (req, res) => {
  try {
    const { projectId, whyMeEssay = "", aiTestScore = 0 } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const studentId = req.user.id;

      // if (!req.user.isVerified) {
    //   return res
    //     .status(403)
    //     .json({ message: "Verification required to apply for internships" });
    // }

    const existingApplication = await Application.findOne({
      projectId,
      studentId,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this project" });
    }

    // Already has an active project?
    const activeApplication = await Application.findOne({
      studentId,
      status: "accepted",
    });
    if (activeApplication) {
      return res.status(400).json({ message: "You already have an active project" });
    }

    // Max 3 pending applications per student
    const pendingCount = await Application.countDocuments({
      studentId,
      status: "pending",
    });
    if (pendingCount >= 3) {
      return res
        .status(400)
        .json({ message: "You already have 3 active applications. Wait for a result." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.applicants && project.applicants.length >= 10) {
      return res.status(400).json({ message: "applicant seats filled" });
    }

    if (project.selectedStudent) {
      return res.status(400).json({ message: "Project already assigned" });
    }

    const newApplication = new Application({
      projectId,
      studentId,
      whyMeEssay,
      aiTestScore,
      status: "pending",
    });

    await newApplication.save();

    project.applicants.push(studentId);
    await project.save();

    res.status(201).json({
      message: "Successfully applied to the project",
      application: newApplication,
    });
  } catch (error) {
    console.error("applyForProject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/me
// @access  Private (Student)
exports.getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const apps = await Application.find({ studentId })
      .populate({
        path: "projectId",
        select: "title status businessId budget difficulty contractType",
        populate: { path: "businessId", select: "name email" },
      })
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error("getMyApplications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get applications for a project (business owner only)
// @route   GET /api/applications/project/:projectId
// @access  Private (Business owner)
exports.getApplicationsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.businessId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const apps = await Application.find({ projectId })
      .populate("studentId", "name email isVerified")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error("getApplicationsForProject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Accept an application — sets selectedStudent, marks project in-progress,
//         auto-rejects all other applications for the same project.
// @route   PATCH /api/applications/:id/accept
// @access  Private (Business owner)
exports.acceptApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const project = await Project.findById(app.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.businessId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (project.selectedStudent) {
      return res.status(400).json({ message: "Project already has a selected student" });
    }

    // Accept this application
    app.status = "accepted";
    await app.save();

    // Auto-reject every other pending application for this project
    await Application.updateMany(
      { projectId: app.projectId, _id: { $ne: app._id }, status: "pending" },
      { $set: { status: "rejected" } }
    );

    // Update project state
    project.selectedStudent = app.studentId;
    project.status = "in-progress";
    await project.save();

    res.json({ message: "Application accepted", application: app, project });
  } catch (error) {
    console.error("acceptApplication error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reject an application
// @route   PATCH /api/applications/:id/reject
// @access  Private (Business owner)
exports.rejectApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const project = await Project.findById(app.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.businessId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (app.status !== "pending") {
      return res.status(400).json({ message: "Application is not pending" });
    }

    app.status = "rejected";
    await app.save();

    // Remove from project's applicants array (frees one slot)
    project.applicants = project.applicants.filter(
      (id) => id.toString() !== app.studentId.toString()
    );
    await project.save();

    res.json({ message: "Application rejected", application: app });
  } catch (error) {
    console.error("rejectApplication error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
