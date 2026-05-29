/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🌐 translate.js — ভাষা অনুবাদ
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");
module.exports.config = {
  name: "translate",
  aliases: ["tr", "অনুবাদ"],
  version: "2.0.0",
  author: "Belal YT",
  description: "যেকোনো ভাষায় অনুবাদ করে",
  usage: "/translate [ভাষা কোড] [টেক্সট]\nউদাহরণ: /translate en আমি ভালো আছি",
  category: "🌐 টুলস",
  cooldowns: 3,
  hasPermssion: 0,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  if (args.length < 2) {
    return api.sendMessage(
      `🌐 অনুবাদ ব্যবহার:\n/translate [ভাষা] [টেক্সট]\n\n📋 ভাষা কোড:\n• bn = বাংলা\n• en = ইংরেজি\n• hi = হিন্দি\n• ar = আরবি\n• zh = চীনা\n• fr = ফরাসি`,
      threadID, messageID
    );
  }
  const to = args[0];
  const text = args.slice(1).join(" ") || event.messageReply?.body;
  if (!text) return api.sendMessage("❌ অনুবাদ করার টেক্সট দিন।", threadID, messageID);

  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    );
    const translated = res.data[0].map(x => x[0]).join("");
    api.sendMessage(`🌐 অনুবাদ (→ ${to}):\n━━━━━━━━━━━\n${translated}`, threadID, messageID);
  } catch {
    api.sendMessage("❌ অনুবাদ করতে সমস্যা হয়েছে।", threadID, messageID);
  }
};
