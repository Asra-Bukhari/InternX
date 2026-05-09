const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    whyMeEssay: { type: String, default: "" },
    aiTestScore: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
