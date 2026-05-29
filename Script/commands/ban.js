/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚫 ban.js — ইউজার ব্যান সিস্টেম
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const moment = require("moment-timezone");
module.exports.config = {
  name: "ban",
  aliases: ["block"],
  version: "2.0.0",
  author: "Belal YT",
  description: "ইউজারকে বট ব্যবহার থেকে ব্যান করে",
  usage: "/ban [mention/@uid] [কারণ]",
  category: "👮 অ্যাডমিন",
  cooldowns: 3,
  hasPermssion: 2,
};
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions, senderID } = event;
  const targets = Object.keys(mentions || {});
  if (!targets.length && event.messageReply) targets.push(event.messageReply.senderID);
  if (!targets.length) return api.sendMessage("❌ কাকে ব্যান করবেন mention করুন।", threadID, messageID);

  const reason = args.filter(a => !a.startsWith("@")).join(" ") || "কারণ উল্লেখ নেই";
  const date = moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm");
  let msg = "🚫 ব্যান রিপোর্ট:\n━━━━━━━━━━━━━━\n";

  for (const uid of targets) {
    if (global.config.ADMINBOT.includes(uid)) { msg += `⛔ ${uid} — অ্যাডমিন ব্যান করা যাবে না!\n`; continue; }
    if (global.data.userBanned.has(uid)) { msg += `⚠️ ${uid} — আগেই ব্যান আছে!\n`; continue; }
    global.data.userBanned.set(uid, { reason, dateAdded: date });
    msg += `✅ ব্যান হয়েছে: ${uid}\n📝 কারণ: ${reason}\n📅 তারিখ: ${date}\n`;
  }
  api.sendMessage(msg, threadID, messageID);
};
