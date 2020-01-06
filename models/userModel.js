const db = require("../data/dbConfig.js");

const users = "users";

exports.getUserById = id => {
  return db("users")
    .where({ id })
    .first();
};

exports.createUser = body => {
  return db("users")
    .returning([
      "id",
      "first_name as firstName",
      "last_name as lastName",
      "email"
    ])
    .insert(body);
};
