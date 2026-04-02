const Record = require("../models/Record");


// =======================
// CREATE RECORD
// =======================
exports.createRecord = async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// =======================
// GET ALL RECORDS
// =======================
exports.getRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =======================
// DASHBOARD SUMMARY
// =======================
exports.getSummary = async (req, res) => {
  try {
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =======================
// CATEGORY SUMMARY
// =======================
exports.getCategorySummary = async (req, res) => {
  try {
    const summary = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =======================
// RECENT TRANSACTIONS
// =======================
exports.getRecent = async (req, res) => {
  try {
    const records = await Record.find()
      .sort({ date: -1 })
      .limit(5);

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};