const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const { authorize } = require("../middleware/authMiddleware");

// CREATE (admin only)
router.post("/", authorize(["admin"]), recordController.createRecord);

// GET ALL (all roles)
router.get("/", authorize(["admin", "analyst", "viewer"]), recordController.getRecords);

// SUMMARY (admin + analyst)
router.get("/summary", authorize(["admin", "analyst"]), recordController.getSummary);

// CATEGORY SUMMARY
router.get("/category-summary", authorize(["admin", "analyst"]), recordController.getCategorySummary);

// RECENT
router.get("/recent", authorize(["admin", "analyst"]), recordController.getRecent);

// UPDATE (admin only)
router.put("/:id", authorize(["admin"]), recordController.updateRecord);

// DELETE (admin only)
router.delete("/:id", authorize(["admin"]), recordController.deleteRecord);

module.exports = router;