/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔍 stalk.js — Facebook প্রোফাইল দেখা
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");
module.exports.config = {
  name: "stalk",
  aliases: ["profile", "fb"],
  version: "2.0.0",
  author: "Belal YT",
  description: "Facebook প্রোফাইল তথ্য দেখায়",
  usage: "/stalk [uid] অথবা mention করে",
  category: "🔍 তথ্য",
  cooldowns: 10,
  hasPermssion: 0,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions, senderID } = event;

  let targetID = senderID;
  if (Object.keys(mentions || {}).length > 0) targetID = Object.keys(mentions)[0];
  else if (event.messageReply) targetID = event.messageReply.senderID;
  else if (args[0] && /^\d+$/.test(args[0])) targetID = args[0];

  try {
    const info = await api.getUserInfo(targetID);
    const user = info?.[targetID];
    if (!user) return api.sendMessage("❌ প্রোফাইল তথ্য পাওয়া যায়নি।", threadID, messageID);

    const msg =
      `╔══════════════════════╗\n` +
      `║  🔍 প্রোফাইল তথ্য   ║\n` +
      `╚══════════════════════╝\n` +
      `👤 নাম: ${user.name || "অজানা"}\n` +
      `🆔 UID: ${targetID}\n` +
      `👫 লিঙ্গ: ${user.gender === 1 ? "♀️ মহিলা" : user.gender === 2 ? "♂️ পুরুষ" : "অজানা"}\n` +
      `🔗 প্রোফাইল: facebook.com/${user.vanity || targetID}\n` +
      `┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়🪬❈┉┄`;

    const picUrl = user.thumbSrc || user.profilePicLarge;
    if (picUrl) {
      const imgRes = await axios.get(picUrl, { responseType: "arraybuffer" });
      const { Readable } = require("stream");
      const stream = Readable.from(Buffer.from(imgRes.data));
      stream.path = "profile.jpg";
      return api.sendMessage({ body: msg, attachment: stream }, threadID, messageID);
    }
    api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    api.sendMessage(`❌ প্রোফাইল দেখতে সমস্যা: ${err.message}`, threadID, messageID);
  }
};
