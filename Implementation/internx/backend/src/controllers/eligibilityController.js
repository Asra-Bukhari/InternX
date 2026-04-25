const User = require("../models/User");
const Profile = require("../models/Profile");
const Project = require("../models/Project");
const Application = require("../models/Application");

// Helper: check if a date is valid and in the future
const isAvailable = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const now = new Date();
  return new Date(startDate) <= now && new Date(endDate) >= now;
};

// Helper: calculate skill match score
const getSkillMatch = (studentSkills = [], projectSkills = []) => {
  if (projectSkills.length === 0) return { matched: [], missing: [], score: 100 };

  const studentSkillsLower = studentSkills.map((s) => s.toLowerCase());
  const projectSkillsLower = projectSkills.map((s) => s.toLowerCase());

  const matched = projectSkillsLower.filter((s) => studentSkillsLower.includes(s));
  const missing = projectSkillsLower.filter((s) => !studentSkillsLower.includes(s));
  const score = Math.round((matched.length / projectSkills.length) * 100);

  return { matched, missing, score };
};

// @desc    Check if logged-in student is eligible for a project
// @route   GET /api/eligibility/check/:projectId
// @access  Private (student only)
exports.checkEligibility = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { projectId } = req.params;

    // --- Fetch project ---
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ eligible: false, reason: "Project not found" });
    }

    if (project.status !== "open") {
      return res.status(200).json({ eligible: false, reason: "This project is no longer accepting applications" });
    }

    // --- Fetch student profile ---
    const profile = await Profile.findOne({ userId: studentId });
    if (!profile) {
      return res.status(200).json({ eligible: false, reason: "Student profile not found. Please complete your profile first" });
    }

    // --- Rule 1: Student must be verified ---
    if (!req.user.isVerified) {
      return res.status(200).json({ eligible: false, reason: "Your account is not verified. Please verify your email first" });
    }

    // --- Rule 2: Student must not already have an active (accepted) application ---
    const activeApplication = await Application.findOne({
      studentId,
      status: "accepted",
    });
    if (activeApplication) {
      return res.status(200).json({ eligible: false, reason: "You already have an active internship. Complete it before applying to another" });
    }

    // --- Rule 3: Student must not have already applied to this project ---
    const existingApplication = await Application.findOne({ projectId, studentId });
    if (existingApplication) {
      return res.status(200).json({ eligible: false, reason: `You have already applied to this project (status: ${existingApplication.status})` });
    }

    // --- Rule 4: Student availability must be valid ---
    if (!isAvailable(profile.availability?.startDate, profile.availability?.endDate)) {
      return res.status(200).json({ eligible: false, reason: "Your availability dates are not set or have expired. Please update your profile" });
    }

    // --- Rule 5: Skill match check ---
    const { matched, missing, score } = getSkillMatch(profile.skills, project.skillsRequired);

    if (score < 50) {
      return res.status(200).json({
        eligible: false,
        reason: `Insufficient skill match. You match ${score}% of required skills`,
        details: { matched, missing, matchScore: `${score}%` },
      });
    }

    // --- All checks passed ---
    return res.status(200).json({
      eligible: true,
      reason: "Student is eligible to apply",
      details: {
        matched,
        missing,
        matchScore: `${score}%`,
        note: missing.length > 0 ? `You are missing some skills: ${missing.join(", ")}` : "You match all required skills",
      },
    });
  } catch (error) {
    console.error("Eligibility check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
