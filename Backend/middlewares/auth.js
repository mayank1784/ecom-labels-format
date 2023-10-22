const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

exports.authorize = async (req, res, next) => {
  // Check if the 'Authorization' header is present in the request
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Retrieve session token from the 'Authorization' header
  const sessionToken = authHeader.split(' ')[1];

  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized but session token retrieved" });
    }
    // Attach the user object to the request for further processing
    req.user = decoded.user;
    next();
  });
};
