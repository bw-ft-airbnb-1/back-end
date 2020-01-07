const db = require("../data/dbConfig.js");
const AppError = require("../utils/appError");

exports.getUserById = id => {
  return db("users")
    .select(["id", "name", "email", "avatar"])
    .where({ id })
    .first();
};

exports.createUser = body => {
  return db("users").insert(body, ["id", "name", "email", "avatar"]);
};

exports.getUserByEmail = email => {
  return db("users")
    .select(["id", "name", "email", "avatar", "password"])
    .where({ email })
    .first();
};

exports.update = (id, body) => {
  return db("users")
    .where({ id })
    .update(body, ["id", "name", "email", "avatar"]);
};

exports.delete = id => {
  return db("users")
    .where({ id })
    .del();
};

exports.getAllUsers = () => {
  return db("users").select("id", "name", "email", "avatar");
};
