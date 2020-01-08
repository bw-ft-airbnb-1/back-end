const db = require("../data/dbConfig.js");
const {
  findAllAmenitiesForProperties,
  getAllPropertiesByUserId
} = require("./propertyModel");

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

exports.getProperties = async userid => {
  const propertiesRes = await getAllPropertiesByUserId(userid);
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
