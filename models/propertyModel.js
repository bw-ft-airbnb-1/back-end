const db = require("../data/dbConfig.js");
const faker = require("faker");
const AppError = require("../utils/appError");

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

/// FINDS PROPERTY BY ID - ONLY RETURNS PROPERTY OBJECTS WITHOUT AMENITIES
exports.findPropertyById = propertyid => {
  return db("properties as p")
    .select(defaultSelectProperties)
    .where("p.id", "=", propertyid)
    .first()
    .join("property_types as pt", "pt.id", "=", "p.property_type_id")
    .join("bed_types as bt", "bt.id", "=", "p.bed_type_id")
    .join("room_types as rt", "rt.id", "=", "p.room_type_id");
};

exports.getAllAmenitiesForProperties = propertyid => {
  return db("properties_amenities as pa")
    .select("a.name")
    .where("pa.property_id", "=", propertyid)
    .join("amenities as a", "a.id", "=", "pa.amenity_id");
};

exports.addAmenitiesToProperties = async (amenities, id) => {
  await Promise.all(
    amenities.map(async amenity => {

      await db("properties_amenities").insert({
        property_id: id,
        amenity_id: amenity.id
      });
      return;
    })
  );
  return;
};

exports.editAmenitiesToProperties = async (amenities, id) => {
  await Promise.all(
    amenities.map(async amenity => {
      await db("properties_amenities").update({
        property_id: id,
        amenity_id: amenity.id
      });
      return;
    })
  );
  return;
};

exports.createProperty = async (body, amenities) => {
  const id = await db("properties")
    .insert(body)
    .returning("id");
  if (!amenities) {
    const property = await this.findPropertyById(id[0]);
    property.amenities = [];
    return property;
  } else {
    await this.addAmenitiesToProperties(amenities, id[0]);
    const amenitiesRes = await this.findAllAmenitiesForProperties(id[0]);
    const property = await this.findPropertyById(id[0]);
    property.amenities = amenitiesRes;
    return property;
  }
};

exports.editProperty = async (body, amenities) => {
  const id = await db("properties")
    .where({ id: body.id })
    .update(body)
    .returning("id");

  if (!amenities) {
    const property = await this.findPropertyById(id[0]);
    property.amenities = [];
    return property;
  } else {
    await this.addAmenitiesToProperties(amenities, id[0]);
    const amenitiesRes = await this.findAllAmenitiesForProperties(id[0]);
    const property = await this.findPropertyById(id[0]);
    property.amenities = amenitiesRes;
    return property;
  }
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

exports.checkAmenities = async amenities => {
  const amenitiesToAdd = Object.keys(amenities)
    .map((amenity, index) => {
      if (amenities[amenity] !== false) {
        return Object.keys(amenities)[index];
      }
    })
    .filter(amenity => amenity);
  const amenitiesPromise = await Promise.all(
    amenitiesToAdd.map(async amenity => {
      const checking = await db("amenities")
        .select("id")
        .where("name", "=", amenity)
        .first();
      if (!checking) {
        throw new AppError(`Could not find amenity ${amenity}`, 401);
      }
      return checking;
    })
  );
  return amenitiesPromise;
};

exports.checkTypes = async types => {
  const { bed_type, room_type, property_type } = types;
  let bedType = db("bed_types")
    .select("id")
    .where("bed_types.type", "=", bed_type)
    .first();

  let roomType = db("room_types")
    .select("id")
    .where("room_types.type", "=", room_type)
    .first();
  let propertyType = db("property_types")
    .select("id")
    .where("property_types.type", "=", property_type)
    .first();
  [bedType, roomType, propertyType] = await Promise.all([
    bedType,
    roomType,
    propertyType
  ]);
  if (!bedType || !roomType || !propertyType) {
    throw new AppError(
      "Could not find the right bed type, room type, or property type",
      401
    );
  }
  return {
    bed_type_id: bedType.id,
    room_type_id: roomType.id,
    property_type_id: propertyType.id
  };
};
