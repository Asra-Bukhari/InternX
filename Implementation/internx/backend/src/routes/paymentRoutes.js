const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { requireVerifiedStudent } = require("../middlewares/verifiedStudentMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");
const {
  createPayment,
  getMyPayments,
  completePayment,
} = require("../controllers/paymentController");

router.use(protect);
router.use(requireVerifiedStudent);

router.post("/", restrictTo("business"), createPayment);
router.get("/me", getMyPayments);
router.patch("/:id/complete", restrictTo("business"), completePayment);

module.exports = router;
