const { expressjwt: jwt } = require('express-jwt')

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'pizza',
  getToken: getTokenFromHeaders,
})

/* fetch('http://asdfddhgf', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({}),
}) */

// Function used to extracts the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Log to see if the token is correctly passed from the frontend
  console.log(req.headers.authorization)
  // Check if the token is available on the request Headers
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(' ')[1]
    return token
  }

  return null
}

// Export the middleware so that we can use it to create a protected routes
module.exports = {
  isAuthenticated,
}