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
      tbl.integer("minimum_nights").notNullable();
      tbl.integer("bedrooms").notNullable(); /// 1 - 12
      tbl.integer("bathrooms").notNullable(); /// 1 - 6
      tbl.integer("security_deposit").notNullable();
      tbl.integer("price").notNullable(); // NEED TO
      tbl.string("image").notNullable(); // NEED TO
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
