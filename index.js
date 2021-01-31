const express = require("express");
const config = require("config");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
// custom
// const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("Error: jwtPrivateKey is not defined");
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
// app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
// // app.use(logger);
app.use("/", home);
app.use("/api/courses", courses);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
