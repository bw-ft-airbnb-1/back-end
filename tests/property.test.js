const server = require("../app");
const request = require("supertest");
const db = require("../data/dbConfig");

const user = {
  name: "HEY",
  email: "hey1asdasd@gmail.com",
  password: "hello123456"
};

const property = {
  optimal_price: 1000,
  minimum_nights: 3,
  bedrooms: 10,
  bathrooms: 5,
  security_deposit: 200,
  price: 1200,
  zip_code: 60000,
  accommodates: 10,
  room_type: "shared room",
  property_type: "hotel",
  bed_type: "airbed",
  amenities: []
};

const tables = ["properties", "users", "properties_amenities"];
Promise.each = async function(arr, fn) {
  for (const item of arr) await fn(item);
};

function truncate() {
  return Promise.each(tables, function(table) {
    return db.raw("truncate table " + table + " cascade");
  });
}
let token, anotherToken;
let propertyID, anotherPropertyID;
describe("DB", () => {
  beforeAll(async () => {
    await truncate();
  });
  describe("Post New User", () => {
    it("Should Post with status 200", () => {
      return request(server)
        .post("/api/v1/user/register")
        .send(user)
        .then(async res => {
          token = res.body.token;
          console.log(token)
          expect(res.status).toBe(200);
        });
    });
    it("POST ANOTHER USER", () => {
      return request(server)
        .post("/api/v1/user/register")
        .send({ ...user, email: "whatsup123@gmail.com" })
        .then(async res => {
          anotherToken = res.body.token;
          expect(res.status).toBe(200);
        });
    });
  }); //// TO ADD A PROPERTY AND TRY TO EDIT IT USING SOMEONE ELSES ACC
  describe("Create Property", () => {
    it("should return 401 - wrong body", () => {
      return request(server)
        .post("/api/v1/properties")
        .set("Authorization", token)
        .send({
          noData: "haha",
          password: "whyNoT"
        })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("Should Post New Property", () => {
      return request(server)
        .post("/api/v1/properties")
        .set("Authorization", token)
        .send(property)
        .then(res => {
          propertyID = res.body.id;
          expect(res.status).toBe(200);
        });
    }); /// ADD PROPERTY FOR THE OTHER GUY
    it("Should Post Another Property", () => {
      return request(server)
        .post("/api/v1/properties")
        .set("Authorization", anotherToken)
        .send(property)
        .then(res => {
          anotherPropertyID = res.body.id;
          expect(res.status).toBe(200);
        });
    });
    it("Should fail no token", () => {
      return request(server)
        .post("/api/v1/properties")
        .send(property)
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });
  describe("Edit Property", () => {
    it("should return 401 - wrong body", () => {
      return request(server)
        .put(`/api/v1/properties/${propertyID}`)
        .set("Authorization", token)
        .send({
          noData: "haha",
          password: "whyNoT"
        })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("should return 401 - no token", () => {
      return request(server)
        .put(`/api/v1/properties/${propertyID}`)
        .send(property)
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("should return 403 - not authorized to edit someone elses property", () => {
      return request(server)
        .put(`/api/v1/properties/${anotherPropertyID}`)
        .set("Authorization", token)
        .send(property)
        .then(res => {
          expect(res.status).toBe(403);
        });
    });
    ///////////// W
    // it("should return 200 - SUCCESS", () => {
    //   return request(server)
    //     .put(`/api/v1/properties/${propertyID}`)
    //     .set("Authorization", token)
    //     .send({ ...property, optimal_price: 500 })
    //     .then(res => {
    //       expect(res.status).toBe(401);
    //     });
    // });
  });
  describe("Get all properties for user", () => {
    it("Should return 401 - No token", () => {
      return request(server)
        .get("/api/v1/user/properties")
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("Should return 200 - Success", () => {
      return request(server)
        .get("/api/v1/user/properties")
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });
  describe("Get property By id", () => {
    it("Should return 401 - No token", () => {
      return request(server)
        .get(`/api/v1/properties/${propertyID}`)
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("Should return 200 - Success", () => {
      return request(server)
        .get(`/api/v1/properties/${propertyID}`)
        .set("Authorization", token)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  }); 
  describe("delete A Property", () => {
    it("should return 401 - Need a token", () => {
      return request(server)
        .delete(`/api/v1/properties/${propertyID}`)
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("should return 403 - Not authorized to delete this", () => {
      return request(server)
        .delete(`/api/v1/properties/${anotherPropertyID}`)
        .set("Authorization", token)
        .then(res => {
          expect(res.status).toBe(403);
        });
    });
    it("should return 200 - Success", () => {
      return request(server)
        .delete(`/api/v1/properties/${propertyID}`)
        .set("Authorization", token)
        .then(res => {
          console.log(res.text);
          expect(res.status).toBe(200);
        });//// 
    });
  });
});
