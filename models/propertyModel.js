const db = require("../data/dbConfig.js");

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
  "pt.type as property_type",
  "bt.type as bed_types",
  "rt.type as room_type"
];

/// FINDS PROPERTY BY ID - ONLY RETURNS PROPERTY OBJECT
exports.findPropertyById = propertyid => {
  return db("properties as p")
    .select(defaultSelectProperties)
    .where("p.id", "=", propertyid)
    .first()
    .join("property_types as pt", "pt.id", "=", "p.property_type_id")
    .join("bed_types as bt", "bt.id", "=", "p.bed_type_id")
    .join("room_types as rt", "rt.id", "=", "p.room_type_id");
};

exports.findAllAmenitiesForProperties = propertyid => {
  return db("properties_amenities as pa")
    .join("amenities as a", "a.id", "=", "pa.amenity_id")
    .where("pa.property_id", "=", propertyid)
    .select("name");
};

exports.getAllPropertiesByUserId = userid => {
  return db("properties as p")
    .select(defaultSelectProperties)
    .where("user_id", "=", userid)

    .join("property_types as pt", "pt.id", "=", "p.property_type_id")
    .join("bed_types as bt", "bt.id", "=", "p.bed_type_id")
    .join("room_types as rt", "rt.id", "=", "p.room_type_id");
};

exports.deleteAProperty = propertyid => {
  return db("properties")
    .del()
    .where({ id: propertyid });
};

exports.findPropertiesOptions = async () => {
  const propertyTypes = db("property_types");
  const roomTypes = db("room_types");
  const bedTypes = db("bed_types");
  const amenities = db("amenities");
  const arr = [propertyTypes, roomTypes, bedTypes, amenities];
  const res = await Promise.all(arr);
  const [propertyTypesArr, roomTypesArr, bedTypesArr, amenitiesArr] = res;
  return {
    propertyTypes: propertyTypesArr,
    roomTypes: roomTypesArr,
    bedTypes: bedTypesArr,
    amenities: amenitiesArr
  };
};
