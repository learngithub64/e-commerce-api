const cors = require("cors");
const express = require("express");
const config = require("config");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
// custom
const register = require("./routes/register");
const login = require("./routes/login");
const basket = require("./routes/basket");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("Custom Error: jwtPrivateKey is not defined");
  process.exit(1);
}

const url =
  "mongodb+srv://stefan:L75FpLEVuYWccqbn@cluster0.qfssq.mongodb.net/eCommerce?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/basket", basket);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
