const jwt = require("jsonwebtoken");

function parseCookie(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach((part) => {
    const [k, v] = part.trim().split("=");
    if (k && v !== undefined) out[k] = decodeURIComponent(v);
  });
  return out;
}

module.exports = (req, res) => {
  const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
  const cookies = parseCookie(req.headers.cookie || "");
  const token = cookies["auth"];
  if (!token) {
    return res.status(200).json({ user: null, roles: [], expiresAt: null, reason: null, approver: null });
  }
  try {
    const d = jwt.verify(token, SECRET, { algorithms: ["HS256"] });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      user: d.sub || null,
      roles: d.roles || [],
      expiresAt: (d.exp || 0) * 1000,
      reason: d.reason || null,
      approver: d.approver || null,
    });
  } catch {
    res.setHeader("Set-Cookie", "auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
    return res.status(200).json({ user: null, roles: [], expiresAt: null, reason: null, approver: null });
  }
};
