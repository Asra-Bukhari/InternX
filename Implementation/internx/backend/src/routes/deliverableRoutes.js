const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");
const {
  submitDeliverable,
  getProjectDeliverables,
  approveDeliverable,
} = require("../controllers/deliverableController");

router.use(protect);
router.use(requireVerifiedStudent);

// Debug log to ensure route file is loaded
console.log("Deliverable routes registered");

router.post("/", (req, res, next) => {
  console.log(`Received ${req.method} request at ${req.originalUrl}`);
  next();
}, restrictTo("student"), submitDeliverable);
router.get("/:projectId", getProjectDeliverables);
router.patch("/:id/approve", restrictTo("business"), approveDeliverable);

module.exports = router;
