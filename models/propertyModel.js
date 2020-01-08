const db = require("../data/dbConfig.js");

const defaultSelectProperties = [
  "id",
  "minimum_nights as minimumNights",
  "bedrooms",
  "bathrooms",
  "entire_place as entirePlace",
  "accommodates",
  "property_type as propertyType",
  "city",
  "state",
  "zip_code as zipCode",
  "address",
  "user_id as ownerId",
  "bed_type as bedType",
  "security_deposit as securityDeposit",
  "optimal_price as optimalPrice"
];

exports.getAllPropertiesByUserId = userid => {
  return db("properties")
    .where("user_id", "=", userid)
    .select(defaultSelectProperties);
};

exports.getAllPhotosForProperties = propertyid => {
  return db("properties_images")
    .where("property_id", "=", propertyid)
    .select("url");
};

exports.getAllAmenitiesForProperties = propertyid => {
  return db("properties_amenities as pa")
    .join("amenities as a", "a.id", "=", "pa.amenity_id")
    .where("pa.property_id", "=", propertyid)
    .select("name");
};

exports.getAllPropertiesWithExtras = async userid => {
  const propertiesRes = await this.getAllPropertiesByUserId(userid);

  const properties = await Promise.all(
    propertiesRes.map(async property => {
      const photosRes = this.getAllPhotosForProperties(property.id);
      const amenitiesRes = this.getAllAmenitiesForProperties(property.id);
      const res = await Promise.all([photosRes, amenitiesRes]);
      const [photos, amenities] = res;
      property.photos = photos.map(photo => photo.url);
      property.amenities = amenities.map(amenity => amenity.name);
      return property;
    })
  );

  return properties;
};

exports.deleteAProperty = propertyid => {
  return db("properties")
    .del()
    .where({ id: propertyid });
};

exports.findPropertyById = propertyid => {
  return db("properties")
    .select(defaultSelectProperties)
    .where({ id: propertyid })
    .first();
};

exports.findCompletePropertyById = async propertyid => {
  const propertyRes = this.findPropertyById(propertyid);
  const photosRes = this.getAllPhotosForProperties(propertyid);
  const amenitiesRes = this.getAllAmenitiesForProperties(propertyid);
  const res = await Promise.all([propertyRes, photosRes, amenitiesRes]);
  const [property, photos, amenities] = res;
  property.images = photos.map(photo => photo.url);
  property.amenities = amenities.map(amenity => amenity.name);
  return property;
};
