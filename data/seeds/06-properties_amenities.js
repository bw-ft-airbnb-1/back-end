class PropertiesAmenities {
  constructor(amenity_id, property_id) {
    this.amenity_id = amenity_id;
    this.property_id = property_id;
  }
}
let houseID = 1;
let amenityID = 1;
const propertiesAmenities = [];
for (let i = 1; i <= 50; i++) {
  if (amenityID === 50 && houseID === 11) {
    amenityID = 1;
    houseID = 1;
    propertiesAmenities.push(new PropertiesAmenities(amenityID, houseID));
    amenityID++;
    houseID++;
  } else if (amenityID === 50 && houseID <= 10) {
    amenityID = 1;
    propertiesAmenities.push(new PropertiesAmenities(amenityID, houseID));
    amenityID++;
  } else if (houseID === 11 && amenityID < 6) {
    houseID = 1;
    propertiesAmenities.push(new PropertiesAmenities(amenityID, houseID));
    houseID++;
  } else {
    propertiesAmenities.push(new PropertiesAmenities(amenityID, houseID));
  }
}

exports.seed = function(knex) {
  return knex("properties_amenities").insert(propertiesAmenities);
};
