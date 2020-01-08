const server = require("../app");
const request = require("supertest");
const db = require("../data/dbConfig");
const User = require("../models/userModel");

const user = { name: "HEY", email: "hey1asdasd@gmail.com", password: "123456" };

describe("DB", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  describe("Post New User", () => {
    it("Should return 401", () => {
      return request(server)
        .post("/api/v1/user/register")
        .send({ name: "HEY" })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("Should Post with status 200", () => {
      return request(server)
        .post("/api/v1/user/register")
        .send(user)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  });
  describe("SIGN IN", () => {
    it("Should Return a 401", () => {
      return request(server)
        .post("/api/v1/user/signin")
        .send({ email: "NOUSERFOUND@GMAIL.com", password: "YeaRight" })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("Should Return a 401 MISSING email", () => {
      return request(server)
        .post("/api/v1/user/signin")
        .send({ password: "123456" })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });
});
