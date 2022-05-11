const express = require("express");
const { user, tours } = require("./user");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const port = 3009;
app.listen(port, () => {
  console.log("hai", `${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World", `${port}`);
});

//checkauth get call
const checkAuth = (req, res, next) => {
  console.log("samplesss");
  const { TokenExpiredError } = jwt;
  const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
      return res
        .status(401)
        .send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
  };
  const token = req.headers["x-access-token"];
  console.log("tokens", token);
  if (!token) {
    res.status(400).json({
      errors: [{ msg: "No Token Found" }],
    });
  }
  jwt.verify(token, "kjsdksdlkslds12ksjdksd", (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    next();
  });
};

//Home page get api
app.get("/home", checkAuth, (req, res) => {
  console.log("sample");
  res.status(200).json({
    status: "success",
    data: {
      tours,
    },
  });
});

//signup
app.post("/signup", (req, res) => {
  const { password, email } = req.body;
  console.log(req);
  let data = user.find((el) => el.email === email);
  console.log("database user available", user);
  if (data) {
    res.status(400).json({
      status: "failed",
      errors: [{ msg: "Email Already Exists" }],
    });
  }
  user.push({
    email,
    password,
  });
  const token = jwt.sign({ email }, "kjsdksdlkslds12ksjdksd", {
    expiresIn: "1m",
  });
  console.log("signup token", token);
  res.status(200).json({
    status: "success",
    token: token,
  });
  console.log(user);
});

//login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req);
  const data = user.find((el) => el.email === email);
  console.log("login available data", data);
  if (!data) {
    res.status(401).json({
      status: "failed",
      error: { msg: "no data found" },
    });
  }
  const token = jwt.sign({ email }, "kjsdksdlkslds12ksjdksd", {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ email }, "kjsdksdlkslds12ksjdksd", {
    expiresIn: "1h",
  });
  console.log("login token", token);
  res.status(200).json({
    status: "success",
    message: {
      token,
      refreshToken,
    },
  });
});

//refresh Token Handler
app.post("/refresh", (req, res) => {
  let refreshToken = req.body["x-access-token"];
  // let refreshToken=req.body.refreshToken
  let decode = jwt.decode(refreshToken);
  console.log("haidecode", decode);
  console.log("hai mail", decode.email);
  let currentEmail = decode.email;
  // let Email = user.find((el) => el.email === decode.email);
  // console.log("emails====>", Email);
  console.log(currentEmail);
  if (currentEmail) {
    const token = jwt.sign({ currentEmail }, "kjsdksdlkslds12ksjdksd", {
      expiresIn: "1m",
    });
    return res.status(200).json({
      status: "success",
      data: {
        token,
        refreshToken,
      },
    });
  }
});
