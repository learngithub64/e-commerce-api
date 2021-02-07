const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const basketSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  products: [productSchema],
});

const Basket = mongoose.model("Basket", basketSchema);

exports.Basket = Basket;
