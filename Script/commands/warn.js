/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️ warn.js — সদস্যকে সতর্ক করা
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const warnData = new Map();
module.exports.config = {
  name: "warn",
  aliases: ["warning"],
  version: "2.0.0",
  author: "Belal YT",
  description: "সদস্যকে সতর্ক করে, ৩টি warn হলে kick",
  usage: "/warn [mention] [কারণ]",
  category: "👮 অ্যাডমিন",
  cooldowns: 5,
  hasPermssion: 1,
};
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions } = event;
  const targets = Object.keys(mentions || {});
  if (!targets.length && event.messageReply) targets.push(event.messageReply.senderID);
  if (!targets.length) return api.sendMessage("❌ কাকে warn করবেন mention করুন।", threadID, messageID);

  const reason = args.filter(a => !a.startsWith("@")).join(" ") || "কারণ উল্লেখ নেই";
  for (const uid of targets) {
    if (global.config.ADMINBOT.includes(uid)) continue;
    const key = `${threadID}_${uid}`;
    const count = (warnData.get(key) || 0) + 1;
    warnData.set(key, count);
    if (count >= 3) {
      warnData.delete(key);
      try { await api.removeUserFromGroup(uid, threadID); } catch {}
      api.sendMessage(`⛔ ${uid} কে ৩টি warn এর কারণে kick করা হয়েছে।`, threadID, messageID);
    } else {
      api.sendMessage(
        `⚠️ সতর্কবার্তা!\n👤 UID: ${uid}\n📝 কারণ: ${reason}\n🔢 মোট warn: ${count}/3\n⚠️ ৩টি warn হলে kick করা হবে।`,
        threadID, messageID
      );
    }
  }
};
