const Project = require("../models/Project");

const ALLOWED_FIELDS = [
  "title",
  "summary",
  "description",
  "category",
  "skillsRequired",
  "difficulty",
  "contractType",
  "durationLabel",
  "hoursPerDay",
  "budget",
  "paymentNotes",
  "deliverables",
];

function pickBody(body) {
  const out = {};
  for (const k of ALLOWED_FIELDS) {
    if (body[k] !== undefined) out[k] = body[k];
  }
  return out;
}

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (business only)
exports.createProject = async (req, res) => {
  try {
    const data = pickBody(req.body);
    if (!data.title || !data.description || !data.difficulty || !data.contractType) {
      return res
        .status(400)
        .json({ message: "title, description, difficulty, and contractType are required" });
    }
    if (!data.skillsRequired || data.skillsRequired.length < 3) {
      return res.status(400).json({ message: "Select at least 3 technology tags" });
    }
    if (data.skillsRequired.length > 6) {
      return res.status(400).json({ message: "Maximum 6 technology tags allowed" });
    }
    if (data.deliverables && data.deliverables.length > 10) {
      return res.status(400).json({ message: "Maximum 10 deliverables allowed" });
    }

    const project = await Project.create({
      ...data,
      businessId: req.user._id,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get open projects (marketplace) — optional filters
// @route   GET /api/projects
// @access  Private (any authenticated user)
exports.getAllProjects = async (req, res) => {
  try {
    const { skillsRequired, difficulty, contractType, owner } = req.query;

    let filter;
    if (owner === "me") {
      // Owner view — return all the caller's projects regardless of status
      filter = { businessId: req.user._id };
    } else {
      // Marketplace view — open and unassigned
      filter = { status: "open", selectedStudent: { $exists: false } };
    }

    if (difficulty) filter.difficulty = difficulty;
    if (contractType) filter.contractType = contractType;
    if (skillsRequired) {
      const skillsArray = skillsRequired.split(",").map((s) => s.trim());
      filter.skillsRequired = { $in: skillsArray };
    }

    const projects = await Project.find(filter)
      .populate("businessId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: projects.length, projects });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("businessId", "name email")
      .populate("selectedStudent", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private (owner business only)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this project" });
    }

    const data = pickBody(req.body);
    Object.assign(project, data);
    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private (owner business only)
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["open", "in-progress", "completed"];

    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `status must be one of: ${validStatuses.join(", ")}` });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this project" });
    }

    project.status = status;
    await project.save();

    res.status(200).json({ message: `Project status updated to '${status}'`, project });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
