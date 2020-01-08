class PropertiesAmenities {
  constructor(amenity_id, property_id) {
    this.amenity_id = amenity_id;
    this.property_id = property_id;
  }
}

let amenityAmmount = 1;
let houseid = 1;
const propertiesAmenities = [];
for (let i = 0; i < 160; i++) {
  if (amenityAmmount < 8) {
    propertiesAmenities.push(new PropertiesAmenities(amenityAmmount, houseid));
    amenityAmmount++;
  } else if(amenityAmmount === 8) {
    propertiesAmenities.push(new PropertiesAmenities(amenityAmmount, houseid));
    amenityAmmount = 1;
    houseid++;
  }
}

exports.seed = function(knex) {
  return knex("properties_amenities").insert(propertiesAmenities);
};
