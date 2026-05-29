"use strict";
module.exports = function ({ Sequelize, sequelize }) {
  const Users = require("./models/users")({ Sequelize, sequelize });
  const Threads = require("./models/threads")({ Sequelize, sequelize });
  const Currencies = require("./models/currencies")({ Sequelize, sequelize });
  return { Users, Threads, Currencies };
};
