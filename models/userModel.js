const db = require("../data/dbConfig.js");

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
exports.getAllPropertiesByUserId = userid => {
  return db("properties as p")
    .select(defaultSelectProperties)
    .where("user_id", "=", userid)
    .join("property_types as pt", "pt.id", "=", "p.property_type_id")
    .join("bed_types as bt", "bt.id", "=", "p.bed_type_id")
    .join("room_types as rt", "rt.id", "=", "p.room_type_id");
};

exports.getProperties = async userid => {
  const propertiesRes = await this.getAllPropertiesByUserId(userid);
  const properties = await Promise.all(
    propertiesRes.map(async property => {
      const amenities = await findAllAmenitiesForProperties(property.id);
      property.amenities = amenities;
      return property;
    })
  );
  return properties;
};

