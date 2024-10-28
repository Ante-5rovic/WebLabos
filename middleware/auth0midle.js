const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.API_IDENTIFIER;

const checkAuth = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience: audience, 
  issuer: `https://${domain}/`, 
  algorithms: ['RS256']
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SEC_CLIENT_SECRET,
  baseURL: process.env.SEC_BASE_URL,
  clientID: process.env.SEC_CLIENT_ID,
  issuerBaseURL: "https://dev-tor07tfe57trlp2l.us.auth0.com/",
};

module.exports = { checkAuth,config };