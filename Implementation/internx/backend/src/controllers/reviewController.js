const Review = require("../models/Review");
const Project = require("../models/Project");
const Payment = require("../models/Payment");
const Profile = require("../models/Profile");

// @desc    Submit a review after project completion
// @route   POST /api/reviews
// @access  Private (Verified Student / Business)
exports.submitReview = async (req, res) => {
  try {
    const { projectId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    if (!projectId || !revieweeId || !rating) {
      return res.status(400).json({ message: "projectId, revieweeId, and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify project completion
    if (project.status !== "completed") {
      return res.status(400).json({ message: "Reviews are only allowed after project is completed" });
    }

    // Verify payment completion
    const payment = await Payment.findOne({ projectId });
    if (!payment || payment.status !== "paid") {
      return res.status(400).json({ message: "Reviews are only allowed after payment is completed" });
    }

    // Check if user is involved in the project
    const businessIdStr = project.businessId.toString();
    const studentIdStr = project.selectedStudent.toString();

    if (reviewerId !== businessIdStr && reviewerId !== studentIdStr) {
      return res.status(403).json({ message: "You are not authorized to leave a review for this project" });
    }

    // Ensure reviewee is actually the other party
    if (revieweeId !== businessIdStr && revieweeId !== studentIdStr) {
      return res.status(400).json({ message: "Invalid reviewee for this project" });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ projectId, reviewerId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already left a review for this project" });
    }

    const newReview = new Review({
      projectId,
      reviewerId,
      revieweeId,
      rating,
      comment,
    });

    await newReview.save();

    // If reviewee is a student, update their Profile
    if (revieweeId === studentIdStr) {
      const profile = await Profile.findOne({ userId: revieweeId });
      if (profile) {
        // Recalculate average rating
        const allReviews = await Review.find({ revieweeId });
        const totalRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avgRating = totalRating / allReviews.length;

        profile.rating = avgRating;
        // The business leaves a review for the student, it means they completed a project with them
        profile.completedProjects += 1; 
        
        await profile.save();
      }
    }

    res.status(201).json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error("submitReview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    View all reviews of a user
// @route   GET /api/reviews/user/:id
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ revieweeId: id }).populate("reviewerId", "name role");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("getUserReviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
