let expect = require("chai").expect;
let isValid = require("../../src/helpers/isValidEmail");

describe("To check if email is valid", function () {
  it("Check email to be valid", (done) => {
    let email = "vv@gmail.com";
    expect(isValid(email))[0]=email
    done();
  });
  it("Check email to be invalid", (done) => {
    let email = "vv@@gmail.com";
    expect(isValid(email)).equal(null);
    done();
  });
});
