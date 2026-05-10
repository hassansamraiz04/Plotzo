const ROLE_SELLER = "SELLER";

export const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((role) => String(role).toUpperCase());

  return (req, res, next) => {
    const role = String(req.userRole || "").toUpperCase();

    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    if (!normalizedAllowed.includes(role)) {
      return res.status(403).json({
        message: "You are not allowed to perform this action",
        code: "FORBIDDEN_ROLE",
        requiredRoles: normalizedAllowed,
        currentRole: role || "UNKNOWN",
      });
    }

    next();
  };
};

export const requireSeller = requireRole(ROLE_SELLER);