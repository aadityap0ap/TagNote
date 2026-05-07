require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { userModel } = require("./src/databases/db");
const { userRouter } = require("./src/routes/user");

const app = express();

app.use(express.json());

app.use("/user", userRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);

  app.listen(3000);

  console.log("Listening on Port 3000");
}

main();