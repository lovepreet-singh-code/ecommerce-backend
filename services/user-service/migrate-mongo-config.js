/* eslint-disable @typescript-eslint/no-require-imports */
/* migrate-mongo-config.js */
require("dotenv").config();

module.exports = {
  mongodb: {
    // use your .env MONGO_URI
    url: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce-users",
    databaseName: "ecommerce-users",
    options: {}, // keep empty for newer Mongo driver
  },

  // where migration files live (must match folder name)
  migrationsDir: "migrations",

  // ensure create uses .js extension
  migrationFileExtension: ".js",

  // collection to track applied migrations
  changelogCollectionName: "changelog",
};
