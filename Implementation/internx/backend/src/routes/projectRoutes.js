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
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");

// PROTECTED ROUTES BELOW
router.use(protect);

// GET  /api/projects        → public: browse all open projects (with optional filters)
router.get("/", requireVerifiedStudent, getAllProjects);

// GET  /api/projects/:id    → get single project details
router.get("/:id", requireVerifiedStudent, getProjectById);

router.use(requireVerifiedStudent);

// POST /api/projects        → private (business only): create a new project
router.post("/", restrictTo("business"), createProject);

// PUT  /api/projects/:id    → private (business only): update project details
router.put("/:id", restrictTo("business"), updateProject);

// PATCH /api/projects/:id/status → private (business only): update project status
router.patch("/:id/status", restrictTo("business"), updateProjectStatus);

module.exports = router;
