const User = require("../models/User");

exports.authorize = (roles) => {
return async (req, res, next) => {
try {
const userRole = req.headers.role;

  // ❌ No role provided
  if (!userRole) {
    return res.status(403).json({ message: "Access denied: No role provided" });
  }

  // 🔍 Find user by role (simple simulation)
  const user = await User.findOne({ role: userRole });

  // ❌ User not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔥 Check if user is inactive
  if (user.status === "inactive") {
    return res.status(403).json({ message: "User is inactive" });
  }

  // ❌ Role not allowed
  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  // ✅ All checks passed
  next();

} catch (err) {
  res.status(500).json({ message: err.message });
}

};
};