const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();

const app = express();

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});