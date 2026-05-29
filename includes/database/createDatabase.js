/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   BELAL BOTX666 — Database Models
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

"use strict";

module.exports = function ({ Sequelize, sequelize }) {
  const Users = require("./models/users")({ Sequelize, sequelize });
  const Threads = require("./models/threads")({ Sequelize, sequelize });
  const Currencies = require("./models/currencies")({ Sequelize, sequelize });

  const UsersController = require("../controllers/users")({ models: { Users }, api: global.client?.api });
  const ThreadsController = require("../controllers/threads")({ models: { Threads }, api: global.client?.api });
  const CurrenciesController = require("../controllers/currencies")({ models: { Currencies } });

  return {
    Users: UsersController,
    Threads: ThreadsController,
    Currencies: CurrenciesController,
    _models: { Users, Threads, Currencies },
  };
};
