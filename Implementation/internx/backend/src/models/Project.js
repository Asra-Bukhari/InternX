const mongoose = require("mongoose");

const deliverableSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    deadline: String,
    paymentPercent: { type: Number, default: 0 },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: String,
    summary: String,
    description: String,
    category: String,
    skillsRequired: [String],

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    contractType: {
      type: String,
      enum: ["fixed", "hourly"],
    },

    durationLabel: String,
    hoursPerDay: String,
    budget: { type: Number, default: 0 },
    paymentNotes: String,

    deliverables: [deliverableSchema],

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
