const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ["mcq", "coding", "short_answer"],
    required: true,
  },
  options: [String],
  correctAnswer: { type: String },
});

const skillTestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testType: {
      type: String,
      enum: ["skill_badge", "project_application"],
      required: true,
    },
    skillTopic: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    questions: [questionSchema],

    submittedAnswers: { type: Map, of: String },

    // Evaluation result
    score: { type: Number },
    passed: { type: Boolean },
    feedback: { type: String },

    // Cheating detection
    cheated: { type: Boolean, default: false },
    cheatReason: { type: String }, // "no_face" | "multiple_faces" | "looking_away"
    cheatMessage: { type: String }, // human readable detail

    status: {
      type: String,
      enum: ["generated", "submitted", "evaluated", "cheated"],
      default: "generated",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillTest", skillTestSchema);