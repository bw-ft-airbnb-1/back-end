class PropertyType {
  constructor(type) {
    this.type = type;
  }
}
exports.seed = function(knex) {
  return knex("property_types").insert([
    new PropertyType("apartment"),
    new PropertyType("loft"),
    new PropertyType("house"),
    new PropertyType("hostel"),
    new PropertyType("townhouse"),
    new PropertyType("guest suite"),
    new PropertyType("guest house"),
    new PropertyType("hotel"),
    new PropertyType("boat"),
    new PropertyType("villa"),
    new PropertyType("other")
  ]);
};
