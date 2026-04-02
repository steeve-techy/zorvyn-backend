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
// GET ALL RECORDS (WITH FILTERING)
// =======================
exports.getRecords = async (req, res) => {
  try {
    let { type, category, page = 1, limit = 5 } = req.query;

    // ✅ Convert to numbers safely
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));

    // ✅ Build filter
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    // ✅ Calculate skip
    const skip = (pageNum - 1) * limitNum;

    // ✅ Fetch data
    const [records, total] = await Promise.all([
      Record.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNum),

      Record.countDocuments(filter)
    ]);

    // ✅ Response
    res.json({
      success: true,
      totalRecords: total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: records.length,
      data: records
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
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

// =======================
// UPDATE RECORD
// =======================
exports.updateRecord = async (req, res) => {
try {
const record = await Record.findByIdAndUpdate(
  req.params.id,
  req.body,
  { returnDocument: "after" }
);
if (!record) {
  return res.status(404).json({ message: "Record not found" });
}

res.json(record);

} catch (err) {
res.status(500).json({ message: err.message });
}
};

// =======================
// DELETE RECORD
// =======================
exports.deleteRecord = async (req, res) => {
try {
const record = await Record.findByIdAndDelete(req.params.id);

if (!record) {
  return res.status(404).json({ message: "Record not found" });
}

res.json({ message: "Record deleted successfully" });

} catch (err) {
res.status(500).json({ message: err.message });
}
};