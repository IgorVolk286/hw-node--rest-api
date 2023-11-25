const express = require("express");
const isEmptyBody = require("../middlewars/isEmptyBody.js");

const validateBody = require("../helpers/validationBody.js");

const {
  singup,
  singin,
  getCurrent,
  logout,
} = require("../controllers/auth-controllers.js");
const { userSingupSchema, userSinginSchema } = require("../models/User.js");
const validToken = require("../middlewars/validToken.js");

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSingupSchema),
  singup
);
authRouter.post("/login", isEmptyBody, validateBody(userSinginSchema), singin);
authRouter.post("/logout", validToken, logout);
authRouter.get("/current", validToken, getCurrent);

module.exports = authRouter;
