const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req._id = decoded.id;

    next();
  } catch (error) {
    res.redirect("/login");
  }
}

module.exports = { requireAuth };
