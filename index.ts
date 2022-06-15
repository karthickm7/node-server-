import { use } from "chai";
import { del } from "express/lib/application";

const express = require("express");
let { user, tours } = require("./user");
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
const port = 3016;
app.listen(port, () => {
  console.log("hai", `${port}`);
});

//send request
app.get("/", (req, res) => {
  res.send("Hello World");
});

//checkauth get call
const checkAuth = (req: any, res: any, next) => {
  console.log(req.headers, "samplesss");
  const { TokenExpiredError } = jwt;
  const catchError = (err, res) => {
    console.log("error");
    if (err instanceof TokenExpiredError) {
      return res
        .status(401)
        .send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
  };
  const token = req.headers["x-access-token"];
  console.log("checkauthtokens", token);
  if (!token) {
    res.status(400).json({
      errors: [{ msg: "No Token Found" }],
    });
  }
  jwt.verify(token, "kjsdksdlkslds12ksjdksd", (err: any, decoded: any) => {
    if (err) {
      return catchError(err, res);
    }
    next();
  });
};

//Home page get api
app.get("/home", checkAuth, (req: any, res: any) => {
  res.status(200).json({
    status: "success",
    data: user,
  });
});

//Delete data
app.delete("/Deleteuser/:id", checkAuth, (req: any, res:any) => {
  let delid = req.params.id;
  let deleteddata = user.filter((user: any) => {
    user.id === delid;
  });
  let datas = user.filter((user: any) =>user.id!==delid);
  user=datas
  console.log(datas, "currentuser");
  if (deleteddata) {
    res.status(200).send({ message: "student deleted" });
  } else {
    res.status(404).send("User not found");
  }
});

//get edit user

app.get("/getuser/:id",(req:any,res:any)=>{
  let getid = req.params.id;
  let newUser=user.find((value:any)=>value.id===getid)
  console.log("getid",getid)
  console.log(newUser,"newuser")
  if(newUser){
    res.status(200).json({
      status: "success",
      data: newUser,
    });
  }
  else{
    res.status(404).send("editeduser not found")
  }

})

//edit data
app.put("/Edituser/:id",checkAuth,(req:any,res:any)=>{
  let editid = req.params.id;
  console.log(editid,"editid")
  const data= req.body
  console.log(data,"edited data")
 
  let editeduser = user.find((users:any)=>(
    // console.log(users,"userss")
          users.id === editid
  ))
  console.log(editeduser,"editeduser")
  if(editeduser){
    editeduser.id = data.id,
    editeduser.email= data.email,
    editeduser.name = data.name,
    res.status(200).send(user)
  }
  else{
    return res.status(403).send("user not found")
  }

})
//signup
app.post("/signup", (req: any, res: any) => {
  const { id, name, password, email } = req.body;
  console.log(req);
  let data = user.find((el: { email: any }) => el.email === email);
  console.log("database user available", user);
  if (data) {
    res.status(400).json({
      status: "failed",
      errors: [{ msg: "Email Already Exists" }],
    });
  }
  user.push({
    id,
    name,
    email,
    password,
  });
  const token = jwt.sign({ email }, "kjsdksdlkslds12ksjdksd", {
    expiresIn: "30s",
  });
  console.log("signup token", token);
  res.status(200).json({
    status: "success",
    token: token,
  });
  console.log("ud", user);
});

//login
app.post("/login", (req: any, res: any) => {
  const { email, password } = req.body;
  console.log(req.body,"reqbody");
  const data = user.find((el) => el.email === email);
  console.log("login available data", data);
  if (!data) {
    res.status(401).json({
      status: "failed",
      error: { msg: "no data found" },
    });
  }
  const token = jwt.sign({ email }, "kjsdksdlkslds12ksjdksd", {
    expiresIn: "30s",
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
app.post("/refresh", (req:any, res:any) => {
  let refreshToken = req.body["x-access-token"];
  // let refreshToken=req.body.refreshToken
  let decode = jwt.decode(refreshToken);
  console.log("haidecode", decode);
  console.log("hai mail", decode.email);
  let currentEmail = decode.email;

  console.log(currentEmail);
  if (currentEmail) {
    const token = jwt.sign({ currentEmail }, "kjsdksdlkslds12ksjdksd", {
      expiresIn: "30s",
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
