const server = require("../app");
const request = require("supertest");
const db = require("../data/dbConfig");

const user = {
  name: "HEY",
  email: "hey1asdasd@gmail.com",
  password: "hello123456"
};
const tables = [
  "properties",
  "users",
  "properties_amenities"
];
Promise.each = async function(arr, fn) {
  for (const item of arr) await fn(item);
};

function truncate() {
  return Promise.each(tables, function(table) {
    return db.raw("truncate table " + table + " cascade");
  });
}
let token;
describe("DB", () => {
  beforeAll(async () => {
    return truncate();
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
        .then(async res => {
          expect(res.status).toBe(200);
        });
    });
  });
  describe("SIGN IN", () => {
    it("should return 401", () => {
      return request(server)
        .post("/api/v1/user/signin")
        .send({
          email: "heey@gmail.com",
          password: "1321"
        })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("should sign in 200", () => {
      return request(server)
        .post("/api/v1/user/signin")
        .send({
          email: "hey1asdasd@gmail.com",
          password: "hello123456"
        })
        .then(res => {
          token = res.body.token
          expect(res.status).toBe(200);
        });
    });
  });
  describe("Edit User", () => {
    it("should return 200 success", () => {
      return request(server)
        .put("/api/v1/user/user")
        .set("Authorization", token)
        .send({
          email: "hey1asd@gmail.com",
          name: "HeyyO"
        })
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
    it("Should answer with 401 because token", () => {
      return request(server)
        .put("/api/v1/user/user")
        .send({
          email: "hey1asd@gmail.com",
          name: "HeyyO"
        })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });
  describe("DELETE USER", () => {
    it("Should return 401 because there is no token", () => {
      return request(server)
        .delete("/api/v1/user/user")
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("Should return 200", () => {
      return request(server)
        .delete("/api/v1/user/user")
        .set("Authorization", token)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  });
});
