let chai = require("chai");
let expect = require("chai").expect;
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("../../src/main");
let sinon = require("sinon");
const axios = require("axios");

describe("Verifies the signin flow", function () {
  beforeEach((done) => {
    let signupBody = {
      email: "gg1@gmail.com",
      password: "hell123",
    };
    chai
      .request(server)
      .post("/register")
      .send(signupBody)
      .end((err, res) => {
        done();
      });
  });
  it("Signin is successful", (done) => {
    let signinBody = {
      email: "gg1@gmail.com",
      password: "hell123",
    };
    chai
      .request(server)
      .post("/login")
      .send(signinBody)
      .end((err, res) => {
        expect(res.status).equal(200);
        console.log(res.body);
      });
    done();
  });
  it("Invalid password", (done) => {
    let signinBody = {
      email: "gg1@gmail.com",
      password: "hell23",
    };
    chai
      .request(server)
      .post("/login")
      .send(signinBody)
      .end((err, res) => {
        expect(res.status).equal(401);
        console.log(res.body);
      });
    done();
  });
  it("User not registered", (done) => {
    let signinBody = {
      email: "gg12@gmail.com",
      password: "hell23",
    };
    chai
      .request(server)
      .post("/login")
      .send(signinBody)
      .end((err, res) => {
        expect(res.status).equal(500);
        console.log(res.body);
      });
    done();
  });
});

describe("new api", () => {
  it("should return info", (done) => {
    chai
      .request(server)
      .get("/newsPreferences")
      .send()
      .end((err, res) => {
        expect(res.status).equal(200);
        console.log(res.body);
      });
    done();
  });
});
