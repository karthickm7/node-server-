const express = require("express");
const { user } = require("./user");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const port = 3004;

app.get("/", (req, res) => {
  res.send("Hello World", `${port}`);
});

app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;
  console.log("signup", user);
  let check = user.find((el) => el.username === username);
  if (check) {
    res.status(401).json({
      status: "error",
      message: "email already exist",
    });
  }

  user.push({ username, password, email });

  const token = jwt.sign({ email }, "asdfghjkl");

  console.log(user);
  res.status(200).json({
    status: "success",
    token,
  });
});

app.post("/login", (req, res) => {
  const { password, email } = req.body;
  console.log("login", user);
  let check = user.find((el) => el.email === email);
  if (check) {
    res.status(401).json({
      status: "error",
      message: "email already exist",
    });
  }

  user.push({ password, email });

  const token = jwt.sign({ email }, "asdfghjkl");
  const refreshtoken = jwt.sign({ email }, "");
  console.log(user);
  res.status(200).json({
    status: "success",
    token,
  });
});
app.listen(port, () => {
  console.log("hai", `${port}`);
});
