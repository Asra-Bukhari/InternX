const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);