/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📋 help.js — কমান্ড তালিকা
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
module.exports.config = {
  name: "help",
  aliases: ["menu", "cmd", "কমান্ড", "সাহায্য"],
  version: "3.0.0",
  author: "Belal YT",
  description: "সব কমান্ডের তালিকা দেখায়",
  usage: "/help অথবা /help [কমান্ড নাম]",
  category: "📋 তথ্য",
  cooldowns: 5,
  hasPermssion: 0,
};

module.exports.run = async function ({ api, event, args, prefix, config }) {
  const { threadID, messageID } = event;
  const { commands } = global.client;
  const pfx = prefix || config.PREFIX || "/";

  // নির্দিষ্ট কমান্ডের তথ্য
  if (args[0]) {
    const cmd = commands.get(args[0].toLowerCase());
    if (!cmd) return api.sendMessage(`❌ "${args[0]}" কমান্ড পাওয়া যায়নি।`, threadID, messageID);
    const permText = { 0: "সবাই", 1: "গ্রুপ অ্যাডমিন", 2: "সাপোর্ট", 3: "বট অ্যাডমিন" };
    return api.sendMessage(
      `╔══════════════════════╗\n` +
      `║  📌 কমান্ড তথ্য      ║\n` +
      `╚══════════════════════╝\n` +
      `🔹 নাম: ${cmd.config.name}\n` +
      `📝 বিবরণ: ${cmd.config.description || "নেই"}\n` +
      `⚡ ব্যবহার: ${pfx}${cmd.config.usage || cmd.config.name}\n` +
      `🏷️ ক্যাটাগরি: ${cmd.config.category || "অন্যান্য"}\n` +
      `⏱️ কুলডাউন: ${cmd.config.cooldowns || 3} সেকেন্ড\n` +
      `🔑 অনুমতি: ${permText[cmd.config.hasPermssion || 0]}\n` +
      (cmd.config.aliases?.length ? `🔄 Aliases: ${cmd.config.aliases.join(", ")}` : ""),
      threadID, messageID
    );
  }

  // ক্যাটাগরি অনুযায়ী গ্রুপ করা
  const categories = new Map();
  for (const [name, cmd] of commands) {
    const cat = cmd.config.category || "⚙️ অন্যান্য";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat).push(name);
  }

  let msg =
    `╔══════════════════════════════╗\n` +
    `║  🤖 BELAL BOTX666 কমান্ড মেনু ║\n` +
    `║  ✡️ চাঁদের পাহাড় 🪬         ║\n` +
    `╚══════════════════════════════╝\n\n`;

  for (const [cat, cmds] of categories) {
    msg += `${cat}\n`;
    msg += cmds.map(c => `  • ${pfx}${c}`).join("\n");
    msg += "\n\n";
  }

  msg +=
    `━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📊 মোট কমান্ড: ${commands.size}টি\n` +
    `💡 বিস্তারিত: ${pfx}help [নাম]\n` +
    `📞 সাহায্য: 01913246554\n` +
    `┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়🪬❈┉┄`;

  api.sendMessage(msg, threadID, messageID);
};
