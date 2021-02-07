const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User, validateProduct } = require("../models/user");

router.get("/", auth, async (req, res) => {
  const basket = await User.findById(req.user._id).select("basket");
  res.send(basket);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select(
    "-password -confirmPassword"
  );

  const productPresent = user.basket.find(
    product => product.productId === req.body.productId
  );

  if (!!productPresent) productPresent.quantity += req.body.quantity;
  else {
    const product = {
      productId: req.body.productId,
      quantity: req.body.quantity,
    };
    user.basket.push(product);
  }

  await user.save();
  res.send(user);
});

router.put("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -confirmPassword"
  );
  const productIndex = user.basket.findIndex(
    pr => pr.productId === req.params.id
  );
  if (productIndex < 0)
    return res.status(404).send("The product with the given ID was not found");

  if (user.basket[productIndex].quantity > 1)
    user.basket[productIndex].quantity--;
  else {
    user.basket.splice(productIndex, 1);
  }

  await user.save();
  res.send(user);
});

router.delete("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -confirmPassword"
  );
  user.basket = new Array();

  await user.save();
  res.send(user);
});

module.exports = router;
