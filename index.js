const express = require("express");
const app = express();

app.get("/user/signin", (req, res) => {
  res.send("User Signin Route");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});