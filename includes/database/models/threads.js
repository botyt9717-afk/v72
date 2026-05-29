"use strict";
module.exports = function ({ Sequelize, sequelize }) {
  const Threads = sequelize.define("threads", {
    threadID: { type: Sequelize.STRING, primaryKey: true },
    name: { type: Sequelize.STRING, defaultValue: "" },
    banned: { type: Sequelize.JSON, defaultValue: { status: false, reason: "", dateAdded: "" } },
    data: { type: Sequelize.JSON, defaultValue: {} },
    memberCount: { type: Sequelize.INTEGER, defaultValue: 0 },
  });

  return {
    getAll: async () => await Threads.findAll(),
    getData: async (threadID) => {
      let t = await Threads.findOne({ where: { threadID: String(threadID) } });
      if (!t) t = await Threads.create({ threadID: String(threadID) });
      return t;
    },
    setData: async (threadID, data) => {
      await Threads.upsert({ threadID: String(threadID), ...data });
    },
    getInfo: async (threadID) => {
      try {
        const info = await global.client.api.getThreadInfo(threadID);
        if (!global.data.allThreadID.includes(String(threadID)))
          global.data.allThreadID.push(String(threadID));
        return info;
      } catch { return {}; }
    },
  };
};
