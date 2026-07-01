require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

if (!process.env.VERCEL) {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

module.exports = app;