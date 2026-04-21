const mongoose = require("mongoose");
const User = require("../models/User");
const Profile = require("../models/Profile");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Profile.deleteMany();

  // 👤 STUDENT
  const asra = await User.create({
    name: "Asra Bukhari",
    email: "asra@gmail.com",
    password: "123456",
    role: "student",
    isVerified: true,
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
    email: "ali@company.com",
    password: "123456",
    role: "business",
    isVerified: true,
  });

  console.log("Seed data inserted");
  process.exit();
}

seed();