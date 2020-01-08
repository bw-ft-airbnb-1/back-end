class BedType {
  constructor(type) {
    this.type = type;
  }
}
exports.seed = function(knex) {
  return knex("bed_types").insert([
    new BedType("real bed"),
    new BedType("pull-out sofa"),
    new BedType("futon"),
    new BedType("couch"),
    new BedType("airbed")
  ]);
};