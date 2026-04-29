const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Profile.deleteMany();
  await Project.deleteMany();
  await Application.deleteMany();
  await Message.deleteMany();
  await Notification.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // 👤 STUDENT (Verified, used for project setup)
  const asra = await User.create({
    name: "Asra Bukhari",
    email: "student@internx.com",
    password: hashedPassword,
    role: "student",
    isVerified: true,
  });

  // 👤 UNVERIFIED STUDENT (Used for testing verification)
  const unverifiedStudent = await User.create({
    name: "Test Unverified",
    email: "unverified@internx.com",
    password: hashedPassword,
    role: "student",
    isVerified: false,
  });

  await Profile.create({
    userId: asra._id,
    university: "FAST NUCES",
    degree: "BS CS",
    semester: "6",
    skills: ["React", "Node", "MongoDB"],
    availability: {
      startDate: new Date(),
      endDate: new Date(),
    },
    completedProjects: 2,
    rating: 4.5,
  });

  // 💼 BUSINESS
  const ali = await User.create({
    name: "Ali Ahmed",
    email: "business@internx.com",
    password: hashedPassword,
    role: "business",
    isVerified: true,
  });

  // 🛡️ ADMIN
  const adminUser = await User.create({
    name: "System Admin",
    email: "admin@internx.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });

  // 🚀 PROJECT
  const project = await Project.create({
    businessId: ali._id,
    title: "Fullstack E-commerce Dashboard",
    description: "Build a dashboard using React and Node.js",
    skillsRequired: ["React", "Node.js"],
    difficulty: "medium",
    contractType: "fixed",
    applicants: [asra._id],
    selectedStudent: asra._id,
    status: "in-progress",
  });

  // 📝 APPLICATION
  await Application.create({
    projectId: project._id,
    studentId: asra._id,
    status: "accepted",
  });

  // 💬 MESSAGE
  await Message.create({
    senderId: ali._id,
    receiverId: asra._id,
    projectId: project._id,
    message: "Welcome to the project Asra! Let's get started.",
  });

  // 🔔 NOTIFICATION
  await Notification.create({
    userId: asra._id,
    title: "New Message",
    message: "You have a new message regarding project: Fullstack E-commerce Dashboard",
    type: "message",
    relatedProjectId: project._id,
  });

  console.log("Seed data inserted successfully! Added Project, Application, Messages, and Notifications.");
  process.exit();
}

seed();