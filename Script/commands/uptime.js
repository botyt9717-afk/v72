"use strict";
const moment = require("moment-timezone");
module.exports.config = {
  name: "uptime",
  aliases: ["upt", "runtime"],
  version: "1.0.0",
  author: "Belal YT",
  description: "বট কতক্ষণ ধরে চলছে দেখায়",
  usage: "/uptime",
  category: "⚙️ সিস্টেম",
  cooldowns: 5,
  hasPermssion: 0,
};
module.exports.run = function ({ api, event }) {
  const { threadID, messageID } = event;
  const uptime = Date.now() - global.client.startTime;
  const d = Math.floor(uptime / 86400000);
  const h = Math.floor((uptime % 86400000) / 3600000);
  const m = Math.floor((uptime % 3600000) / 60000);
  const s = Math.floor((uptime % 60000) / 1000);
  api.sendMessage(
    `⏱️ BELAL BOTX666 আপটাইম\n━━━━━━━━━━━━━━━━\n` +
    `🕐 ${d}দিন ${h}ঘণ্টা ${m}মিনিট ${s}সেকেন্ড\n` +
    `📅 চালু হয়েছে: ${moment(global.client.startTime).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}`,
    threadID, messageID
  );
};
