const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const MAX_SECONDS = 5 * 60; // 5 minutes

module.exports = (req, res) => {
  const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
  const q = req.query || {};
  const user = q.user ? String(q.user) : "demo";
  const reason = q.reason ? String(q.reason) : null;
  const approver = q.approver ? String(q.approver) : null;

  const now = Math.floor(Date.now() / 1000);
  const exp = now + MAX_SECONDS;

  const claims = {
    sub: user,
    roles: ["admin"],
    iat: now,
    exp,
    jti: randomUUID(),
  };
  if (reason) claims.reason = reason;
  if (approver) claims.approver = approver;

  const token = jwt.sign(claims, SECRET, { algorithm: "HS256" });

  res.setHeader("Set-Cookie", [
    `auth=${token}`,
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${MAX_SECONDS}`,
  ].join("; "));
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true, user, expiresAt: exp * 1000 });
};
