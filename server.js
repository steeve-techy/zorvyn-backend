require("dotenv").config(); // 🔥 ADD THIS LINE

const app = require("./app");
const connectDB = require("./config/db");

// connect DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});