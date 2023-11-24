const express = require("express");
const isEmptyBody = require("../middlewars/isEmptyBody.js");

const validateBody = require("../helpers/validationBody.js");
// const {
//   User,
//   userSinginSchema,
//   userSingupSchema,
// } = require("../models/User.js");
const { singup, singin } = require("../controllers/auth-controllers.js");
const { userSingupSchema, userSinginSchema } = require("../models/User.js");

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSingupSchema),
  singup
);
authRouter.post("/login", isEmptyBody, validateBody(userSinginSchema), singin);

module.exports = authRouter;
