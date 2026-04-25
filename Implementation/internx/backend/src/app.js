const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/eligibility", eligibilityRoutes);

module.exports = app;