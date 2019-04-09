const { OAuth2Client } = require("google-auth-library");
const config = require("../config/app-config");

const googleClient = new OAuth2Client(config.get("GOOGLE_CLIENT_ID"));

const verifyGoogleId = async tokenId => {
  const ticket = await googleClient.verifyIdToken({
    idToken: tokenId,
    audience: config.get("GOOGLE_CLIENT_ID") // Specify the CLIENT_ID of the app that accesses the backend
  });

  // payload === { email, email_verified, name,
  //	given_name, family_name, locale, picture, ... }
  const payload = ticket.getPayload();
  return payload;
};

module.exports = {
  verifyGoogleId
};
