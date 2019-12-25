// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/dev.sqlite3'
    }
  },
  testing: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/testing.sqlite3'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
};
