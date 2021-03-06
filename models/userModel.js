const db = require("../data/dbConfig.js");
const { findAllAmenitiesForProperties } = require("./propertyModel");

const defaultSelectProperties = [
  "p.id",
  "p.minimum_nights",
  "p.bedrooms",
  "p.bathrooms",
  "p.security_deposit",
  "p.price",
  "p.image",
  "p.zip_code",
  "p.accommodates",
  "p.optimal_price",
  "p.user_id",
  "pt.type as property_type",
  "bt.type as bed_types",
  "rt.type as room_type"
];

exports.getUserById = id => {
  return db("users")
    .select(["id", "name", "email", "avatar"])
    .where({ id })
    .first();
};

exports.getUserByEmail = useremail => {
  return db("users")
    .select(["id", "name", "email", "avatar", "password"])
    .where({ email: useremail })
    .first();
};

exports.createUser = body => {
  return db("users").insert(body, ["id", "name", "email", "avatar"]);
};

exports.update = (userid, editedUser) => {
  return db("users")
    .where({ id: userid })
    .update(editedUser, ["id", "name", "email", "avatar"]);
};

exports.delete = userid => {
  return db("users")
    .where({ id: userid })
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
      console.log(amenities);
      return property;
    })
  );
  return properties;
};
