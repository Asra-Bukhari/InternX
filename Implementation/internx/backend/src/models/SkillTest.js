const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ["mcq", "coding", "short_answer"],
    required: true,
  },
  options: [String], // only for MCQ
  correctAnswer: { type: String }, // used internally for evaluation hint
});

const skillTestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Either a skill name (voluntary) or a project ID (application test)
    testType: {
      type: String,
      enum: ["skill_badge", "project_application"],
      required: true,
    },
    skillTopic: { type: String }, // e.g. "UI/UX", "Machine Learning"
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    questions: [questionSchema],

    // Student's submitted answers: { questionIndex: answerText }
    submittedAnswers: { type: Map, of: String },

    // Evaluation result
    score: { type: Number }, // 0–100
    passed: { type: Boolean },
    feedback: { type: String }, // LLM's overall feedback

    status: {
      type: String,
      enum: ["generated", "submitted", "evaluated"],
      default: "generated",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillTest", skillTestSchema);