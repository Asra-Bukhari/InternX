const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    university: String,
    degree: String,
    semester: String,
    skills: [String],

    availability: {
      startDate: Date,
      endDate: Date,
    },

    completedProjects: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);