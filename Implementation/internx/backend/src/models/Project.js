const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: String,
    description: String,
    skillsRequired: [String],

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    contractType: {
      type: String,
      enum: ["fixed", "hourly"],
    },

    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    selectedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);