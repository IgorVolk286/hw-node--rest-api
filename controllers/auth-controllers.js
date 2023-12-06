const { User } = require("../models/User.js");
const bcrypt = require("bcryptjs");
const HttpErr = require("../helpers/HttpError.js");
const sendmail = require("../helpers/sendEmail.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
dotenv.config();
const { SECRET_KEY, BASE_URL } = process.env;

const publicPath = path.resolve("public", "avatars");

const singup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpErr(409, "Email in use");
    }
    const hashpassword = await bcrypt.hash(password, 10);
    // console.log(hashpassword);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashpassword,
      avatarURL,
      verificationToken,
    });
    const veryficationMail = {
      to: email,
      subject: "Verification email",

      html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}"> Click to verify </a>`,
    };
    await sendmail(veryficationMail);
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

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpErr(404, "User not found");
    }

    await User.findOneAndUpdate(user._id, {
      verify: true,
      verificationToken: " ",
    });
    res.status(200).json({
      message: "Verification successful",
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
    if (!user.verify) {
      throw HttpErr(401, "Email not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    // console.log(passwordCompare);
    if (!passwordCompare) {
      throw HttpErr(401, "Email or password is wrong");
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email,
        subscription: "starter",
      },
    });
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

    console.log(subscription);
    await User.findByIdAndUpdate(_id, { subscription });
    res.json({ message: "Subscription is update" });
  } catch (error) {
    next(HttpErr(401, "Incorrect value"));
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    console.log(req.file);
    const newFilename = `${_id}_${filename}`;
    await Jimp.read(oldPath).then((image) => {
      return image.resize(250, 250).grayscale().write(oldPath);
    });

    const newPath = path.join(publicPath, newFilename);

    await fs.rename(oldPath, newPath);

    const avatar = path.join("avatars", newFilename);

    await User.findByIdAndUpdate(_id, { avatarURL: avatar });

    res.status(201).json({
      avatarURL: avatar,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  singup,
  singin,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  verify,
};
