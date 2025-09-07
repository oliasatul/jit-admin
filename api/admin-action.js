const jwt = require("jsonwebtoken");

function parseCookie(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach(part => {
    const [k, v] = part.trim().split("=");
    if (k && v !== undefined) out[k] = decodeURIComponent(v);
  });
  return out;
}

module.exports = (req, res) => {
  const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
  const cookies = parseCookie(req.headers.cookie || "");
  const token = cookies["auth"];
  if (!token) return res.status(401).json({ ok: false, error: "No auth" });

  try {
    const decoded = jwt.verify(token, SECRET, { algorithms: ["HS256"] });
    const roles = decoded.roles || [];
    if (!roles.includes("admin")) {
      return res.status(403).json({ ok: false, error: "Not an admin" });
    }
    // Protected action example (replace with any sensitive op)
    return res.status(200).json({
      ok: true,
      message: `Admin-only action completed for ${decoded.sub}. 🎉`
    });
  } catch {
    return res.status(401).json({ ok: false, error: "Expired or invalid token" });
  }
};
