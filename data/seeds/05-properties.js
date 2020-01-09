const faker = require("faker");
const randomNumber = num => Math.ceil(Math.random() * num);
class Property {
  constructor(id) {
    this.minimum_nights = randomNumber(10);
    this.bedrooms = randomNumber(12);
    this.bathrooms = randomNumber(6);
    this.security_deposit = randomNumber(1500);
    this.price = this.minimum_nights * this.bedrooms * this.bathrooms;
    this.image = faker.image.image();
    this.accommodates = randomNumber(13);
    this.zip_code = faker.address.zipCode().split("-")[0];
    this.user_id = id;
    this.property_type_id = randomNumber(11);
    this.bed_type_id = randomNumber(5);
    this.room_type_id = randomNumber(3);
    this.optimal_price = randomNumber(1000);
  }
}
const properties = [];
for (let i = 1; i <= 10; i++) {
  properties.push(new Property(i));
}
exports.seed = function(knex) {
  return knex("properties").insert(properties);
};
