module.exports = (req, res) => {
  // Clear cookie immediately
  res.setHeader(
    "Set-Cookie",
    "auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );
  res.status(200).json({ ok: true });
};
