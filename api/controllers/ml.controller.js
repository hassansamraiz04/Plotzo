/**
 * Proxies sanitized listing features to the Python AI microservice.
 */
export const predictPrice = async (req, res) => {
  const svc =
    process.env.AI_SERVICE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8989";
  try {
    const payload = req.body ?? {};
    const resp = await fetch(`${svc}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      return res.status(502).json({
        message: "AI predictor unavailable",
        code: "AI_PREDICTOR_UNAVAILABLE",
      });
    }
    const data = await resp.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res
      .status(502)
      .json({ message: "AI predictor unreachable", code: "AI_PREDICTOR_UNREACHABLE" });
  }
};

export const predictorHealth = async (_req, res) => {
  const svc =
    process.env.AI_SERVICE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8989";
  try {
    const resp = await fetch(`${svc}/health`, { method: "GET" });
    const data = await resp.json().catch(() => ({}));
    res.status(resp.ok ? 200 : 502).json({ ok: resp.ok, downstream: data });
  } catch (err) {
    res.status(502).json({ ok: false, message: "AI health check unavailable" });
  }
};
