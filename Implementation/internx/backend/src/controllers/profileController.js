const User = require("../models/User");
const Profile = require("../models/Profile");

// @desc    Get logged-in user profile
// @route   GET /api/profile/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });

    res.status(200).json({
      user: req.user,
      profile: profile || null,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Create or update logged-in user's profile
// @route   PUT /api/profile/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { university, degree, semester, skills, availability } = req.body;

    // Build update object with only provided fields
    const updates = {};
    if (university !== undefined) updates.university = university;
    if (degree !== undefined) updates.degree = degree;
    if (semester !== undefined) updates.semester = semester;
    if (skills !== undefined) updates.skills = skills;
    if (availability !== undefined) updates.availability = availability;

    // Create if not exists, update if it does (upsert)
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
