"use strict";
const moment = require("moment-timezone");
module.exports.config = {
  name: "daily",
  aliases: ["checkin", "দৈনিক"],
  version: "2.0.0",
  author: "Belal YT",
  description: "প্রতিদিনের পুরস্কার নেওয়া",
  usage: "/daily",
  category: "💰 ইকোনমি",
  cooldowns: 3,
  hasPermssion: 0,
};
module.exports.run = async function ({ api, event, Currencies }) {
  const { threadID, messageID, senderID } = event;
  try {
    const data = await Currencies.getData(senderID);
    const lastClaim = data.data?.lastDaily;
    const now = moment().tz("Asia/Dhaka");
    if (lastClaim) {
      const diff = now.diff(moment(lastClaim), "hours");
      if (diff < 12) {
        const next = 12 - diff;
        return api.sendMessage(`⏳ আজকের পুরস্কার নেওয়া হয়েছে!\n⏰ পরের পুরস্কার: ${next} ঘন্টা পরে`, threadID, messageID);
      }
    }
    const reward = global.config.ECONOMY?.dailyReward || 1000000;
    await Currencies.addBalance(senderID, reward);
    const updated = data.data || {};
    updated.lastDaily = now.toISOString();
    await Currencies.setBalance(senderID, Number(data.balance) + reward);
    api.sendMessage(
      `✅ দৈনিক পুরস্কার পেয়েছেন!\n💰 +${reward.toLocaleString()} টাকা\n⏰ পরের পুরস্কার: ১২ ঘন্টা পরে`,
      threadID, messageID
    );
  } catch (e) { api.sendMessage(`❌ সমস্যা হয়েছে: ${e.message}`, threadID, messageID); }
};
