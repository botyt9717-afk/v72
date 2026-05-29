/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  💰 balance.js — টাকার হিসাব
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
module.exports.config = {
  name: "balance",
  aliases: ["bal", "টাকা", "money"],
  version: "2.0.0",
  author: "Belal YT",
  description: "আপনার বা অন্যের টাকার পরিমাণ দেখায়",
  usage: "/balance অথবা /balance [mention]",
  category: "💰 ইকোনমি",
  cooldowns: 5,
  hasPermssion: 0,
};
module.exports.run = async function ({ api, event, Currencies }) {
  const { threadID, messageID, senderID, mentions } = event;
  const targetID = Object.keys(mentions || {})[0] || (event.messageReply?.senderID) || senderID;
  try {
    const data = await Currencies.getData(targetID);
    const info = await api.getUserInfo(targetID);
    const name = info?.[targetID]?.name || targetID;
    api.sendMessage(
      `💰 অর্থ তথ্য — ${name}\n━━━━━━━━━━━━━━━━\n` +
      `👛 হাতে: ${Number(data.balance).toLocaleString()} টাকা\n` +
      `🏦 ব্যাংক: ${Number(data.bank || 0).toLocaleString()} টাকা\n` +
      `💎 মোট: ${(Number(data.balance) + Number(data.bank || 0)).toLocaleString()} টাকা`,
      threadID, messageID
    );
  } catch { api.sendMessage("❌ তথ্য পাওয়া যায়নি।", threadID, messageID); }
};
