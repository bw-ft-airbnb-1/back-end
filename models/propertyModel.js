const db = require("../data/dbConfig.js");
const AppError = require("../utils/appError");

exports.getAllPropertiesByUserId = userid => {
  return db("properties")
    .where("user_id", "=", userid)
    .select([
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
      "user_id as ownerID",
      "bed_type as bedType",
      "security_deposit as securityDeposit",
      "optimal_price as optimalPrice"
    ]);
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
  const properties = await this.getAllPropertiesByUserId(userid);
  const getNewProps = async () => {
    return Promise.all(
      properties.map(async property => {
        const photos = await this.getAllPhotosForProperties(property.id);
        const amenities = await this.getAllAmenitiesForProperties(property.id);
        property.photos = photos.map(photo => photo.url);
        property.amenities = amenities.map(amenity => amenity.name);
        return property;
      })
    );
  };
  const newProps = await getNewProps();
  return newProps;
};

exports.deleteAProperty = propertyid => {
  return db('properties').where({id}).del()
}

exports.findOneByID = async propertyid => {
  const property = await db('properties').where({id}).first()
  return property
}

