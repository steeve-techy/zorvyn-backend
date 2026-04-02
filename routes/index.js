const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const recordRoutes = require("./recordRoutes"); // 👈 ADD THIS

router.use("/users", userRoutes);
router.use("/records", recordRoutes); // 👈 ADD THIS

module.exports = router;