const faker = require("faker");
const randomNumber = num => Math.ceil(Math.random() * num);
const pickBetweenPropertyTypes = num => {
  if (num === 1) {
    return "house";
  } else if (num === 2) {
    return "apartment";
  } else if (num === 3) {
    return "townhouse";
  } else if (num === 4) {
    return "guest house";
  }
};

const pickBetweenEntirePlace = num => {
  if (num === 1) {
    return "entire property";
  } else if (num === 2) {
    return "private room";
  } else if (num === 3) {
    return "shared room";
  }
};

const pickBedType = num => {
  if (num === 1) {
    return "real bed";
  } else if (num === 2) {
    return "pull-out sofa";
  } else if (num === 3) {
    return "futon";
  } else if (num === 4) {
    return "couch";
  } else if (num === 5) {
    return "airbed";
  }
};

class Property {
  constructor(id) {
    this.minimum_nights = randomNumber(10);
    this.bedrooms = randomNumber(8);
    this.bathrooms = randomNumber(6);
    this.entire_place = pickBetweenEntirePlace(randomNumber(3));
    this.accommodates = this.bedrooms * 2;
    this.property_type = pickBetweenPropertyTypes(randomNumber(3));
    this.city = faker.address.city();
    this.state = faker.address.state();
    this.zip_code = faker.address.zipCode();
    this.address = faker.address.streetAddress();
    this.user_id = id;
    this.bed_type = pickBedType(5);
    this.security_deposit = (this.bedrooms + this.bathrooms) * 20;
    this.optimal_price = 600;
  }
}
const properties = [];
for (let i = 1; i <= 20; i++) {
  if (i >= 10) {
    properties.push(new Property(Math.ceil(i / 2)));
  } else {
    properties.push(new Property(i));
  }
}
exports.seed = function(knex) {
  return knex("properties").insert(properties);
};
