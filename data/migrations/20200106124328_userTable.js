exports.up = function(knex) {
  return knex.schema
    .createTable("users", tbl => {
      tbl.increments();
      tbl.string("name", 255).notNullable();
      tbl
        .string("email", 255)
        .unique()
        .notNullable();
      tbl.string("avatar");
      tbl.string("password").notNullable();
    })
    .createTable("property_types", tbl => {
      tbl.increments();
      tbl
        .string("type")
        .unique()
        .notNullable();
    })
    .createTable("room_types", tbl => {
      tbl.increments();
      tbl
        .string("type")
        .unique()
        .notNullable();
    })
    .createTable("bed_types", tbl => {
      tbl.increments();
      tbl
        .string("type")
        .unique()
        .notNullable();
    })
    .createTable("properties", tbl => {
      tbl.increments();
      tbl.integer("minimum_nights").notNullable();
      tbl.integer("bedrooms").notNullable(); /// 1 - 12
      tbl.integer("bathrooms").notNullable(); /// 1 - 6
      tbl.integer("security_deposit").notNullable();
      tbl.integer("price").notNullable();
      tbl.string("image").notNullable();
      tbl.integer("zip_code").notNullable();
      tbl.integer("accommodates").notNullable(); /// 1- 13
      tbl
        .integer("room_type_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("room_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("property_type_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("property_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("bed_type_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("bed_types")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("amenities", tbl => {
      tbl.increments();
      tbl
        .string("name")
        .notNullable()
        .unique();
    })
    .createTable("properties_amenities", tbl => {
      tbl
        .integer("amenity_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("amenities")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("property_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("properties")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("properties_amenities")
    .dropTableIfExists("amenities")
    .dropTableIfExists("properties")
    .dropTableIfExists("bed_types")
    .dropTableIfExists("room_types")
    .dropTableIfExists("property_types")
    .dropTableIfExists("users");
};
