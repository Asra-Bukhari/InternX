const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");
const { applyForProject } = require("../controllers/applicationController");

router.use(protect);
router.use(requireVerifiedStudent);
router.use(restrictTo("student"));

router.post("/", requireVerifiedStudent, applyForProject);

module.exports = router;
