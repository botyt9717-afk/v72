"use strict";

module.exports = function ({ Sequelize, sequelize }) {
  const { DataTypes } = Sequelize;

  const Users = sequelize.define("Users", {
    userID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    vanilla: {
      type: DataTypes.TEXT
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    money: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reason: {
      type: DataTypes.TEXT
    },
    data: {
      type: DataTypes.TEXT,
      defaultValue: "{}"
    }
  });

  const Threads = sequelize.define("Threads", {
    threadID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    threadInfo: {
      type: DataTypes.TEXT,
      defaultValue: "{}"
    },
    threadData: {
      type: DataTypes.TEXT,
      defaultValue: "{}"
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reason: {
      type: DataTypes.TEXT
    },
    data: {
      type: DataTypes.TEXT,
      defaultValue: "{}"
    }
  });

  const Currencies = sequelize.define("Currencies", {
    userID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    money: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    data: {
      type: DataTypes.TEXT,
      defaultValue: "{}"
    }
  });

  return {
    Users,
    Threads,
    Currencies
  
};
};
