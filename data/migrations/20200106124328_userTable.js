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
    .createTable("properties", tbl => {
      tbl.increments();
      tbl.integer("minimum_nights");
      tbl.integer("bedrooms");
      tbl.integer("bathrooms");
      tbl.string("entire_place");
      tbl.integer("accommodates");
      tbl.string("property_type");
      tbl.string("city");
      tbl.string("state");
      tbl.string("zip_code");
      tbl.string("address");
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      tbl.string("bed_type")
      tbl.integer("security_deposit")
      tbl.integer("optimal_price")

    })
    .createTable("properties_images", tbl => {
      tbl.increments();
      tbl
        .integer("property_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("properties")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.string("url").notNullable();
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
        .onUpdate("RESTRICT")
        .onDelete("CASCADE");
      tbl
        .integer("property_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("properties")
        .onUpdate("RESTRICT")
        .onDelete("CASCADE");
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("properties_availability")
    .dropTableIfExists("days")
    .dropTableIfExists("properties_amenities")
    .dropTableIfExists("amenities")
    .dropTableIfExists("properties_images")
    .dropTableIfExists("properties")
    .dropTableIfExists("users");
};
