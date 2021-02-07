const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    min: [1, "Quantity cannot be less than 1"],
    required: true,
  },
});

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
  basket: [productSchema],
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      basket: this.basket,
    },
    config.get("jwtPrivateKey")
  );
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

function validateProduct(basket) {
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number()
      .positive("Quantity must be a positive number")
      .required(),
  });
  return schema.validate(basket);
}

exports.User = User;
exports.validate = validateUser;
exports.validateProduct = validateProduct;
