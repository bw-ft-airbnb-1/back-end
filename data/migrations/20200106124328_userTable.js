exports.up = function(knex) {
  return knex.schema.createTable("users", tbl => {
    tbl.increments();
    tbl.string("name", 255).notNullable();
    tbl
      .string("email", 255)
      .unique()
      .notNullable();
    tbl.string("avatar");
    tbl.string("password").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
