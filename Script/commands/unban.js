"use strict";
module.exports.config = {
  name: "unban",
  aliases: ["unblock"],
  version: "2.0.0",
  author: "Belal YT",
  description: "ইউজারের ব্যান তুলে নেয়",
  usage: "/unban [mention]",
  category: "👮 অ্যাডমিন",
  cooldowns: 3,
  hasPermssion: 2,
};
module.exports.run = function ({ api, event }) {
  const { threadID, messageID, mentions } = event;
  const targets = Object.keys(mentions || {});
  if (!targets.length && event.messageReply) targets.push(event.messageReply.senderID);
  if (!targets.length) return api.sendMessage("❌ কাকে unban করবেন mention করুন।", threadID, messageID);
  let msg = "✅ আনব্যান রিপোর্ট:\n━━━━━━━━━━━━━\n";
  for (const uid of targets) {
    if (!global.data.userBanned.has(uid)) { msg += `⚠️ ${uid} — ব্যান নেই!\n`; continue; }
    global.data.userBanned.delete(uid);
    msg += `✅ আনব্যান: ${uid}\n`;
  }
  api.sendMessage(msg, threadID, messageID);
};
