// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "Blackbox123",
      database: "airbnb"
    },
    seeds: {
      directory: "./data/seeds"
    },
    migrations: {
      directory: "./data/migrations"
    }
  },

  testing: {
    client: "sqlite",
    useNullAsDefault: true,
    connection: {
      filename: "./data/testing.sqlite3"
    },
    seeds: {
      directory: "./data/seeds"
    },
    migrations: {
      directory: "./data/migrations"
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: "./data/seeds"
    },
    migrations: {
      directory: "./data/migrations"
    }
  }
};
