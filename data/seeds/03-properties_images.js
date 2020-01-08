const faker = require("faker");
class PropertyImage {
  constructor(id) {
    this.property_id = id;
    this.url = faker.image.image();
  }
}
const propertyImages = [];
for (let i = 1; i < 40; i++) {
  if(i >= 20){
    propertyImages.push(new PropertyImage(Math.ceil(i / 2)));
  }else{
    propertyImages.push(new PropertyImage(Math.ceil(i)));
  }
}
exports.seed = function(knex) {
  return knex("properties_images").insert(propertyImages);
};
