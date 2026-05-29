"use strict";
module.exports = function ({ Sequelize, sequelize }) {
  const Currencies = sequelize.define("currencies", {
    userID: { type: Sequelize.STRING, primaryKey: true },
    balance: { type: Sequelize.BIGINT, defaultValue: 0 },
    bank: { type: Sequelize.BIGINT, defaultValue: 0 },
    data: { type: Sequelize.JSON, defaultValue: {} },
  });

  const startBalance = () => global.config?.ECONOMY?.startBalance || 5000;

  return {
    getAll: async (fields) => {
      const opts = fields ? { attributes: fields } : {};
      return await Currencies.findAll(opts);
    },
    getData: async (userID) => {
      let c = await Currencies.findOne({ where: { userID: String(userID) } });
      if (!c) c = await Currencies.create({ userID: String(userID), balance: startBalance() });
      return c;
    },
    setBalance: async (userID, amount) => {
      await Currencies.upsert({ userID: String(userID), balance: Math.max(0, amount) });
    },
    addBalance: async (userID, amount) => {
      const c = await Currencies.findOne({ where: { userID: String(userID) } });
      if (c) { c.balance = BigInt(c.balance) + BigInt(amount); await c.save(); }
    },
    subtractBalance: async (userID, amount) => {
      const c = await Currencies.findOne({ where: { userID: String(userID) } });
      if (c) { c.balance = Math.max(0, Number(c.balance) - amount); await c.save(); }
    },
  };
};
