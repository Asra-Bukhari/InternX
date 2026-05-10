const express = require("express");
const router = express.Router();
const {
  generateSkillTest,
  generateProjectTest,
  evaluateTest,
  flagCheating,
  getTest,
} = require("../controllers/aiController");

// Voluntary skill badge test
router.post("/generate-skill-test", generateSkillTest);

// Project application test
router.post("/generate-project-test", generateProjectTest);

// Submit answers + evaluate
router.post("/evaluate-test", evaluateTest);

// Flag cheating (called by frontend when proctor detects violation)
router.post("/flag-cheating", flagCheating);

// Get test by ID
router.get("/test/:testId", getTest);

module.exports = router;