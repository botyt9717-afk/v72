"use strict";
const { Sequelize } = require("sequelize");
const path = require("path");
const { DATABASE } = global.config;

const dialect = Object.keys(DATABASE)[0];
const storage = path.resolve(process.cwd(), DATABASE[dialect].storage);

const sequelize = new Sequelize({
  dialect,
  storage,
  pool: { max: 20, min: 0, acquire: 60000, idle: 20000 },
  retry: { match: [/SQLITE_BUSY/], name: "query", max: 20 },
  logging: false,
  transactionType: "IMMEDIATE",
  define: {
    underscored: false,
    freezeTableName: true,
    charset: "utf8",
    timestamps: true,
  },
});

module.exports = { sequelize, Sequelize };
