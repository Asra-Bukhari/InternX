const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);