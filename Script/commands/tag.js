/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📢 tag.js — সবাইকে ট্যাগ করা
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
module.exports.config = {
  name: "tag",
  aliases: ["tagall", "mention", "সবাই"],
  version: "2.0.0",
  author: "Belal YT",
  description: "গ্রুপের সবাইকে ট্যাগ করে",
  usage: "/tag [বার্তা]",
  category: "👥 গ্রুপ",
  cooldowns: 30,
  hasPermssion: 1,
};
module.exports.run = async function ({ api, event, args, input }) {
  const { threadID, messageID } = event;
  const msg = input || args.join(" ") || "📢 সবার দৃষ্টি আকর্ষণ করা হচ্ছে!";
  try {
    const info = await api.getThreadInfo(threadID);
    const members = info.participantIDs.filter(id => id !== api.getCurrentUserID());
    const mentions = members.map(id => ({ tag: "@", id }));
    const body = msg + "\n" + members.map(() => "@").join(" ");
    await api.sendMessage({ body, mentions }, threadID, messageID);
  } catch (err) {
    api.sendMessage(`❌ ট্যাগ করতে সমস্যা: ${err.message}`, threadID, messageID);
  }
};
