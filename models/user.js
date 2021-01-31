const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 250,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(4).max(250).email().required(),
    password: Joi.string().min(5).max(255).required(),
    confirmPassword: Joi.string()
      .equal(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
