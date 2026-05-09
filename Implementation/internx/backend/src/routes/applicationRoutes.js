const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");
const {
  applyForProject,
  getMyApplications,
  getApplicationsForProject,
  acceptApplication,
  rejectApplication,
} = require("../controllers/applicationController");

router.use(protect);

// Student-only
router.post("/", restrictTo("student"), requireVerifiedStudent, applyForProject);
router.get("/me", restrictTo("student"), getMyApplications);

// Business-only
router.get("/project/:projectId", restrictTo("business"), getApplicationsForProject);
router.patch("/:id/accept", restrictTo("business"), acceptApplication);
router.patch("/:id/reject", restrictTo("business"), rejectApplication);

module.exports = router;
