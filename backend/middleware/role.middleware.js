import jwt from "jsonwebtoken";

export const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
