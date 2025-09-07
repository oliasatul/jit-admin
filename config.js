// Returns Auth0 SPA config from environment variables (Vercel)
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    domain: process.env.AUTH0_DOMAIN || "",       // e.g., your-tenant.us.auth0.com
    clientId: process.env.AUTH0_CLIENT_ID || "",  // SPA app client id
    rolesClaim: process.env.AUTH0_ROLES_CLAIM || "https://example.com/roles"
  });
};
