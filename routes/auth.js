const express = require("express");
const isEmptyBody = require("../middlewars/isEmptyBody.js");

const validateBody = require("../helpers/validationBody.js");

const authControllers = require("../controllers/auth-controllers.js");
const { userSingupSchema, userSinginSchema } = require("../models/User.js");
const validToken = require("../middlewars/validToken.js");

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSingupSchema),
  authControllers.singup
);
authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSinginSchema),
  authControllers.singin
);
authRouter.post("/logout", validToken, authControllers.logout);
authRouter.get("/current", validToken, authControllers.getCurrent);
authRouter.patch("/", validToken, authControllers.updateSubscription);

module.exports = authRouter;
