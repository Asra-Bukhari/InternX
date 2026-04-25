const Project = require("../models/Project");

// @desc    Create a new project/internship
// @route   POST /api/projects
// @access  Private (business only)
exports.createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, difficulty, contractType } = req.body;

    if (!title || !description || !difficulty || !contractType) {
      return res.status(400).json({ message: "title, description, difficulty, and contractType are required" });
    }

    const project = await Project.create({
      businessId: req.user._id,
      title,
      description,
      skillsRequired: skillsRequired || [],
      difficulty,
      contractType,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get all open projects with optional filters
// @route   GET /api/projects
// @access  Public
exports.getAllProjects = async (req, res) => {
  try {
    const { skillsRequired, difficulty, contractType } = req.query;

    const filter = { status: "open" };

    if (difficulty) filter.difficulty = difficulty;
    if (contractType) filter.contractType = contractType;
    if (skillsRequired) {
      // Support comma-separated skills: ?skillsRequired=React,Node
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
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("businessId", "name email")
      .populate("selectedStudent", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

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

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the business that created it can update
    if (project.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this project" });
    }

    const { title, description, skillsRequired, difficulty, contractType } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (skillsRequired) project.skillsRequired = skillsRequired;
    if (difficulty) project.difficulty = difficulty;
    if (contractType) project.contractType = contractType;

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
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}` });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

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
