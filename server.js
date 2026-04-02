const app = require("./app");
const connectDB = require("./config/db");

// connect DB
connectDB();

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});