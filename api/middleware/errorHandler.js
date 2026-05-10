export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: "ROUTE_NOT_FOUND",
  });
};

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = Number(err?.status) || 500;
  const message = status >= 500 ? "Internal server error" : err.message;
  res.status(status).json({
    message,
    code: err?.code || (status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR"),
  });
};
