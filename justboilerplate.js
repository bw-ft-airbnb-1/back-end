const jwt = require("jsonwebtoken");

const generateAToken = userData => {
  const privateKey = process.env.TOKEN_SECRET;
  const jwtConfig = {
    expiresIn: 1000 * 60 * 60 * 24 * 7
  };
  const token = jtw.sign({ data: userData }, privateKey, jwtConfig);
  return token;
};

