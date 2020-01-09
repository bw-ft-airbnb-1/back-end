const db = require("../data/dbConfig.js");
const AppError = require("../utils/appError");

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

exports.findAllAmenitiesForProperties = propertyid => {
  return db("properties_amenities as pa")
    .join("amenities as a", "a.id", "=", "pa.amenity_id")
    .where("pa.property_id", "=", propertyid)
    .select("name");
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

exports.editAProperty = async (body, amenities, propertyId) => {
  const id = await db("properties")
    .where("id", "=", propertyId)
    .update(body)
    .returning("id");
  if (!amenities) {
    const property = await this.findPropertyById(id[0]);
    await db("properties_amenities")
      .where("property_id", "=", id)
      .del();
    property.amenities = [];
    return property;
  }
  await db("properties_amenities")
    .where("property_id", "=", propertyId)
    .del();
  await this.addAmenitiesToProperties(amenities, id[0]);
  const amenitiesRes = await this.findAllAmenitiesForProperties(id[0]);
  const property = await this.findPropertyById(id[0]);
  property.amenities = amenitiesRes;
  return property;
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
