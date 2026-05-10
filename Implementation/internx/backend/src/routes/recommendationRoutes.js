const express = require("express");
const router = express.Router();
const {
  recommendProjects,
  recommendApplicants,
} = require("../controllers/recommendationController");

// Recommend projects to a student
router.get("/projects/:studentId", recommendProjects);

// Recommend top applicants to a business for a project
router.get("/applicants/:projectId", recommendApplicants);

module.exports = router;