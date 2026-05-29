"use strict";
module.exports = function ({ Sequelize, sequelize }) {
  const Users = sequelize.define("users", {
    userID: { type: Sequelize.STRING, primaryKey: true },
    name: { type: Sequelize.STRING, defaultValue: "" },
    banned: { type: Sequelize.JSON, defaultValue: { status: false, reason: "", dateAdded: "" } },
    data: { type: Sequelize.JSON, defaultValue: {} },
    exp: { type: Sequelize.INTEGER, defaultValue: 0 },
    level: { type: Sequelize.INTEGER, defaultValue: 1 },
  });

  return {
    getAll: async (fields) => {
      const opts = fields ? { attributes: fields } : {};
      return await Users.findAll(opts);
    },
    getData: async (userID) => {
      let user = await Users.findOne({ where: { userID: String(userID) } });
      if (!user) user = await Users.create({ userID: String(userID) });
      return user;
    },
    setData: async (userID, data) => {
      await Users.upsert({ userID: String(userID), ...data });
    },
    getNameUser: async (userID) => {
      const u = await Users.findOne({ where: { userID: String(userID) } });
      return u?.name || String(userID);
    },
    updateExp: async (userID, addExp = 1) => {
      const u = await Users.findOne({ where: { userID: String(userID) } });
      if (u) {
        u.exp = (u.exp || 0) + addExp;
        await u.save();
      }
    },
  };
};
    
