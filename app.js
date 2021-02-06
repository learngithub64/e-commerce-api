const cors = require("cors");
const express = require("express");
const config = require("config");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
// custom
const courses = require("./routes/courses");
const home = require("./routes/home");
const register = require("./routes/register");
const login = require("./routes/login");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("Custom Error: jwtPrivateKey is not defined");
  process.exit(1);
}

const url =
  "mongodb+srv://stefan:L75FpLEVuYWccqbn@cluster0.qfssq.mongodb.net/courses?retryWrites=true&w=majority";
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
app.use("/", home);
app.use("/api/courses", courses);
app.use("/api/register", register);
app.use("/api/login", login);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
