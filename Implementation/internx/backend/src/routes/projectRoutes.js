const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");

// GET  /api/projects        → public: browse all open projects (with optional filters)
router.get("/", getAllProjects);

// GET  /api/projects/:id    → public: get single project details
router.get("/:id", getProjectById);

// POST /api/projects        → private (business only): create a new project
router.post("/", protect, restrictTo("business"), createProject);

// PUT  /api/projects/:id    → private (business only): update project details
router.put("/:id", protect, restrictTo("business"), updateProject);

// PATCH /api/projects/:id/status → private (business only): update project status
router.patch("/:id/status", protect, restrictTo("business"), updateProjectStatus);

module.exports = router;
