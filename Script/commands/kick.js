"use strict";
module.exports.config = {
  name: "kick",
  aliases: ["remove", "বের"],
  version: "2.0.0",
  author: "Belal YT",
  description: "গ্রুপ থেকে সদস্য বের করে",
  usage: "/kick [mention]",
  category: "👮 অ্যাডমিন",
  cooldowns: 5,
  hasPermssion: 1,
};
module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, mentions } = event;
  const targets = Object.keys(mentions || {});
  if (!targets.length && event.messageReply) targets.push(event.messageReply.senderID);
  if (!targets.length) return api.sendMessage("❌ কাকে বের করবেন mention করুন।", threadID, messageID);
  for (const uid of targets) {
    if (global.config.ADMINBOT.includes(uid)) continue;
    try {
      await api.removeUserFromGroup(uid, threadID);
    } catch (e) { api.sendMessage(`❌ ${uid} বের করা যায়নি: ${e.message}`, threadID); }
  }
  api.sendMessage(`✅ ${targets.length}জনকে গ্রুপ থেকে বের করা হয়েছে।`, threadID, messageID);
};
