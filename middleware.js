
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Invalid or missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Token decoded:", decoded);

    // Attach user ID to request object
    req.userId = decoded.userId || decoded.userid || decoded.id;

    console.log("✅ Token verified. User ID:", req.userId);

    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export default authMiddleware;