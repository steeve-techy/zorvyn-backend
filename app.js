const express = require("express");
const app = express();

// import routes
const routes = require("./routes");

app.use(express.json());

// connect routes
app.use("/api", routes);

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

module.exports = app;