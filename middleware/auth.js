const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = require("crypto").randomBytes(64).toString("hex");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent in the header as 'Bearer [token]'

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET_KEY); // Verifying the token
    req.user = { userId: decodedToken.userId }; // Adding the user's ID to the request object

    next(); // Passing control to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
