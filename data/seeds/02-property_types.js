class PropertyType {
  constructor(type) {
    this.type = type;
  }
}
exports.seed = function(knex) {
  return knex("property_types").insert([
    new PropertyType("house"),
    new PropertyType("townhouse"),
    new PropertyType("apartment"),
    new PropertyType("condominium"),
    new PropertyType("loft"),
    new PropertyType("serviced apartment"),
    new PropertyType("hostel"),
    new PropertyType("bed and breakfast"),
    new PropertyType("guest house"),
    new PropertyType("hotel"),
    new PropertyType("boutique hotel"),
    new PropertyType("bungalow"),
    new PropertyType("boat"),
    new PropertyType("tiny house"),
    new PropertyType("houseboat"),
    new PropertyType("campter/rv"),
    new PropertyType("villa"),
    new PropertyType("aparthotel"),
    new PropertyType("guest suite"),
    new PropertyType("other")
  ]);
};
