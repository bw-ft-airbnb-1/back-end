class Amenities {
  constructor(name) {
    this.name = name;
  }
}

exports.seed = function(knex) {
  return knex("amenities").insert([
    new Amenities("laundry"),
    new Amenities("spa"),
    new Amenities("wifi"),
    new Amenities("cleaning"),
    new Amenities("breakfast"),
    new Amenities("security"),
    new Amenities("pool"),
    new Amenities("patio")
  ]);
};
