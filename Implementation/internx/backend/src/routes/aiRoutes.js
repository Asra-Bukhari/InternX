const express = require("express");
const router = express.Router();
const {
  generateSkillTest,
  generateProjectTest,
  evaluateTest,
  getTest,
} = require("../controllers/aiController");

// Voluntary skill badge test
router.post("/generate-skill-test", generateSkillTest);

// Project application test
router.post("/generate-project-test", generateProjectTest);

// Submit answers + evaluate
router.post("/evaluate-test", evaluateTest);

// Get test by ID (to render questions on frontend)
router.get("/test/:testId", getTest);

module.exports = router;