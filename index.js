const express = require("express");
const { user } = require("./user");
const app = express();
app.use(express.json());
const port = 3004;

app.get("/", (req, res) => {
  res.send("Hello World", `${port}`);
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("signup", user);
  let check = user.find((el) => el.username === username);
  if (check) {
    res.status(401).json({
      status: "error",
      message: "email already exist",
    });
  }

  user.push({ username, password });
  console.log(user);
  res.status(200).json({
    status: "success",
  });
});

app.listen(port, () => {
  console.log("hai", `${port}`);
});
