let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("./index");
chai.use(chaiHttp);
const should = chai.should();

describe("signup form  testcase", () => {
  it("check the post response", (done) => {
    let userdata = { email: "k@gmail.com", password: "kemo" };
    chai
      .request("http://localhost:3009")
      .post("/signup")
      .send(userdata)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("status").eql("success");
      });
    done();
  });
});

describe("login api call", () => {
  it("to check the loging response", (done) => {
    let userdata = { email: "k@gmail.com", password: "kemo" };

    chai
      .request("http://localhost:3009")
      .post("/login")
      .send(userdata)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("status").eql("success");
      });
    done();
  });
});

// describe("get api call", () => {
//   it("To check the get response", (done) => {
//     chai
//       .request("http://localhost:3009")
//       .get("/home")
//       .set("x-access-token", res.body.message.token)
//       .end((err, res) => {
//         console.log(res);
//       });
//     done();
//   });
// });
