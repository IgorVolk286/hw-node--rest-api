const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema(
  {
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // match:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"//
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },

    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
const userSingupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
}); // patern!!!

const userSinginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
const userVerifySchema = Joi.object({
  email: Joi.string().required(),
});

userSchema.post("save", (error, data, next) => {
  const { name, code } = error;

  error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  next();
});
userSchema.post("findOneAndUpdate", (error, data, next) => {
  error.status = 400;

  next();
});
userSchema.pre("findOneAndUpdate", function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
});

const User = model("user", userSchema);

module.exports = {
  User,
  userSingupSchema,
  userSinginSchema,
  userVerifySchema,
};
