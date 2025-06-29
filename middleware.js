import JWT_SECRET from "./config.js";
import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: "Unauthorized: Invalid or missing token" });

    }

    const token = authHeader.split(' ')[1];

    try { 
        const decoded = jwt.verify(token, JWT_SECRET);
         console.log("✅ Token decoded:", decoded);

         req.userId = decoded.userId || decoded.userid || decoded.id;


         console.log("✅ Token verified. User ID:", req.userId);

        next();
    } catch (err) {
        return res.status(403).json({ error: "Unauthorized: Invalid or missing token" });

    }
};

export default authMiddleware;