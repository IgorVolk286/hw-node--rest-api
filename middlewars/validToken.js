const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { SECRET_KEY } = process.env;
const HttpErr = require("../helpers/HttpError.js");
const { User } = require("../models/User.js");

const validToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpErr(401, "authorization is impty"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpErr(401, "Not authorized"));
  }

  try {
    const { id } = await jwt.verify(token, SECRET_KEY);
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      return next(HttpErr(401, "Not authorized"));
    }
    next();
  } catch (error) {
    next(HttpErr(401, error.message));
  }
};

module.exports = validToken;
