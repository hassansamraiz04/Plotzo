import jwt from "jsonwebtoken";

/**
 * Accepts auth via httpOnly cookie `token` or `Authorization: Bearer <jwt>`.
 * Attaches req.userId, req.userRole, req.isAdmin.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = req.cookies?.token;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authenticated",
      code: "AUTH_REQUIRED",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }
    req.userId = payload.id;
    req.userRole = payload.role || "BUYER";
    req.isAdmin = Boolean(payload.isAdmin);
    next();
  });
};
