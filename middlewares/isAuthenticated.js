const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.cookies.jwt;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, "addressbook", async (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "NOT Authorised",
      });
    }

    req.user = user;
    next();
  });
};

module.exports = isAuthenticated;
