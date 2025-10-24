const { expressjwt } = require("express-jwt");

function getTokenFromHeaders(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

const isAuthenticated = expressjwt({
  // use JWT_SECRET env var (aligns with .env.example and hosting providers)
  secret: process.env.JWT_SECRET || process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

module.exports = { isAuthenticated, getTokenFromHeaders };
