const User = require("../models/User");

// 1. Email Verification

// @desc    Send verification code to student email
// @route   POST /api/verification/send-code
// @access  Private (Student)
exports.sendCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate a simple 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = code;
    await user.save();

    // In a real app, send email here. We return the code for testing.
    res.status(200).json({
      message: "Verification code sent successfully",
      code, // returned for testing purposes
    });
  } catch (error) {
    console.error("sendCode error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify code entered by student
// @route   POST /api/verification/verify-email
// @access  Private (Student)
exports.verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    const user = await User.findById(req.user.id);

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Code is correct
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Student Card Verification

// @desc    Upload student card image
// @route   POST /api/verification/upload-student-card
// @access  Private (Student)
exports.uploadStudentCard = async (req, res) => {
  try {
    const { studentCardUrl } = req.body;
    
    if (!studentCardUrl) {
      return res.status(400).json({ message: "studentCardUrl is required" });
    }

    const user = await User.findById(req.user.id);

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.studentCardUrl = studentCardUrl;
    await user.save();

    // Find an admin to notify
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      console.log(`Notifying admin: ${adminUser.email} about student: ${user.email}`);
      const { createInternalNotification } = require("./notificationController");
      await createInternalNotification({
        userId: adminUser._id,
        title: "Student Verification Request",
        message: `Student requested verification through student card: ${user.email}`,
        type: "verification_request",
      });
    } else {
      console.log("No admin user found to notify for verification request.");
    }

    res.status(200).json({ message: "Student card uploaded successfully. Waiting for admin approval." });
  } catch (error) {
    console.error("uploadStudentCard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Admin Approval

// @desc    Admin manually verifies uploaded student card
// @route   PATCH /api/admin/verify-student/:userId
// @access  Private (Admin)
exports.adminVerifyStudent = async (req, res) => {
  try {
    const { userId } = req.params;

    const student = await User.findById(userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.role !== "student") {
      return res.status(400).json({ message: "User is not a student" });
    }

    if (student.isVerified) {
      return res.status(400).json({ message: "Student is already verified" });
    }

    student.isVerified = true;
    // Optionally clear the URL or keep it
    // student.studentCardUrl = undefined;
    await student.save();

    // Notify Student
    const { createInternalNotification } = require("./notificationController");
    await createInternalNotification({
      userId: student._id,
      title: "Account Verified",
      message: "Congratulations! Your account has been verified by the admin.",
      type: "verification_approval",
    });

    res.status(200).json({ message: "Student verified successfully by admin" });
  } catch (error) {
    console.error("adminVerifyStudent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
