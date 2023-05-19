const { expressjwt } = require('express-jwt')

function getTokenFromHeaders(req) {
    if(
        req.headers.authorization && 
        req.headers.authorization.split(' ')[0] === 'Bearer' 
    ){
        const token = req.headers.authorization.split(' ')[1]
        return token
    }

    return null
}

const isAuthenticated = expressjwt(
    {
        secret:process.env.TOKEN_SECRET,
        algorithms: ['HS256'],
        requestProperty: 'payload',
        getToken: getTokenFromHeaders, 
    })

    /* DO LATERRRRR 
    fetch('http://asdfddhgf', {
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

module.exports = { isAuthenticated }