exports.authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.headers.role; // simple simulation

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};