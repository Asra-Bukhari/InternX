const Application = require("../models/Application");
const Project = require("../models/Project");

// @desc    Apply for an internship/project
// @route   POST /api/applications
// @access  Private (Verified Student)
exports.applyForProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const studentId = req.user.id;

    // 1. Check if student is verified
    if (!req.user.isVerified) {
      return res.status(403).json({ message: "Verification required to apply for internships" });
    }

    // 2. Prevent duplicate applications by same student
    const existingApplication = await Application.findOne({
      projectId,
      studentId,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this project" });
    }

    // 3. Students must not already have another active project
    // Check if there is an accepted application for this student
    const activeApplication = await Application.findOne({
      studentId,
      status: "accepted",
    });
    if (activeApplication) {
      return res.status(400).json({ message: "You already have an active project" });
    }

    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 4. Project must allow maximum 10 applicants only
    if (project.applicants && project.applicants.length >= 10) {
      return res.status(400).json({ message: "applicant seats filled" });
    }

    // 5. If project already has selectedStudent -> reject application
    if (project.selectedStudent) {
      return res.status(400).json({ message: "Project already assigned" });
    }

    // Create the application
    const newApplication = new Application({
      projectId,
      studentId,
      status: "pending",
    });

    await newApplication.save();

    // Add student to project's applicants array
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
