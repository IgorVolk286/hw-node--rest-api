const { User } = require("../models/User.js");
const bcrypt = require("bcryptjs");
const HttpErr = require("../helpers/HttpError.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { SECRET_KEY } = process.env;

const singup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpErr(409, "Email in use");
    }
    const hashpassword = await bcrypt.hash(password, 10);
    // console.log(hashpassword);
    const newUser = await User.create({ ...req.body, password: hashpassword });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const singin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpErr(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    // console.log(passwordCompare);
    if (!passwordCompare) {
      throw HttpErr(401, "Email or password is wrong");
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: " " });

    res.status(204);
  } catch (error) {
    next(HttpErr(401));
  }
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;

    console.log(_id);
    await User.findByIdAndUpdate(_id, { subscription });
    res.json({ message: "Subscription is update" });
  } catch (error) {
    next(HttpErr(401, "Incorrect value"));
  }
};
module.exports = {
  singup,
  singin,
  logout,
  getCurrent,
  updateSubscription,
};
