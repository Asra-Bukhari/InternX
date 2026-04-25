const app = require("./src/app");
const connectDB = require("./src/config/db");
require("dotenv").config();

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});