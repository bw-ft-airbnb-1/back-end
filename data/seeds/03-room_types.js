class RoomType {
  constructor(type) {
    this.type = type;
  }
}
exports.seed = function(knex) {
  return knex("room_types").insert([
    new RoomType("private room"),
    new RoomType("entire home/apt"),
    new RoomType("shared room")
  ]);
};
