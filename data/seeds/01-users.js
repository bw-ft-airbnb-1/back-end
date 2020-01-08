const bcrypt = require("bcryptjs");
const faker = require("faker");
class User {
  constructor() {
    this.name = faker.name.firstName();
    this.email = faker.internet.email();
    this.password = bcrypt.hashSync("pass", 8);
    this.avatar = faker.image.avatar();
  }
}
const users = [];
for (let i = 0; i < 10; i++) {
  users.push(new User());
}
exports.seed = function(knex) {
  return knex("users").insert(users);
};
