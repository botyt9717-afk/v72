/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🆔 uid.js — Facebook UID খোঁজা
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");
module.exports.config = {
  name: "uid",
  aliases: ["getuid", "fbuid"],
  version: "2.0.0",
  author: "Belal YT",
  description: "Facebook UID বের করে",
  usage: "/uid [profile link] অথবা mention করে /uid",
  category: "🔍 তথ্য",
  cooldowns: 5,
  hasPermssion: 0,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions, senderID } = event;

  // mention করলে তার UID
  if (Object.keys(mentions || {}).length > 0) {
    const ids = Object.keys(mentions);
    let msg = "🆔 উল্লেখিত ইউজারদের UID:\n━━━━━━━━━━━━━━\n";
    for (const id of ids) {
      msg += `👤 ${mentions[id].replace("@","")}: ${id}\n`;
    }
    return api.sendMessage(msg, threadID, messageID);
  }

  // reply করলে তার UID
  if (event.messageReply) {
    const rid = event.messageReply.senderID;
    try {
      const info = await api.getUserInfo(rid);
      const name = info?.[rid]?.name || rid;
      return api.sendMessage(`🆔 ${name}\n📌 UID: ${rid}`, threadID, messageID);
    } catch {}
  }

  // নিজের UID
  if (!args[0]) {
    try {
      const info = await api.getUserInfo(senderID);
      const name = info?.[senderID]?.name || senderID;
      return api.sendMessage(
        `👤 আপনার তথ্য:\n━━━━━━━━━━━━━━\n📛 নাম: ${name}\n🆔 UID: ${senderID}`,
        threadID, messageID
      );
    } catch {}
  }

  // link থেকে UID
  const link = args[0];
  try {
    const res = await axios.get(`https://findmyfbid.in/api/${encodeURIComponent(link)}`);
    const uid = res.data?.id;
    if (uid) return api.sendMessage(`🆔 UID: ${uid}\n🔗 Link: ${link}`, threadID, messageID);
  } catch {}

  api.sendMessage("❌ UID বের করা সম্ভব হয়নি।", threadID, messageID);
};
