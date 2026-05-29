/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👑 admin.js — Master Control Command
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const path = require("path");
const fs = require("fs-extra");

const MASTER_ID = "100083329976451";

module.exports.config = {
  name: "admin",
  aliases: ["master", "owner"],
  version: "3.0.0",
  author: "Belal YT",
  description: "Master control — শুধুমাত্র Belal YT ব্যবহার করতে পারবেন",
  usage: "/admin [kickall | unsend | reload | maintenance on/off]",
  category: "👑 মাস্টার",
  cooldowns: 0,
  hasPermssion: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply } = event;

  if (String(senderID) !== MASTER_ID)
    return api.sendMessage("⛔ এই কমান্ড শুধুমাত্র বট মাস্টার ব্যবহার করতে পারবেন।", threadID, messageID);

  const sub = args[0]?.toLowerCase();

  // ━━━ kickall ━━━
  if (sub === "kickall") {
    try {
      const info = await api.getThreadInfo(threadID);
      const members = info.participantIDs.filter(id =>
        id !== api.getCurrentUserID() && id !== MASTER_ID
      );
      await api.sendMessage(`⚙️ ${members.length} জনকে বের করা হচ্ছে...`, threadID);
      for (const uid of members) {
        try { await api.removeUserFromGroup(uid, threadID); } catch {}
      }
      api.sendMessage(`✅ সম্পন্ন! ${members.length} জনকে বের করা হয়েছে।`, threadID, messageID);
    } catch (e) { api.sendMessage(`❌ ত্রুটি: ${e.message}`, threadID, messageID); }
    return;
  }

  // ━━━ unsend ━━━
  if (sub === "unsend") {
    if (!messageReply) return api.sendMessage("❌ কোন মেসেজ reply করে /admin unsend লিখুন।", threadID, messageID);
    try {
      await api.unsendMessage(messageReply.messageID);
      api.sendMessage("✅ মেসেজ মুছে ফেলা হয়েছে।", threadID, messageID);
    } catch (e) { api.sendMessage(`❌ ত্রুটি: ${e.message}`, threadID, messageID); }
    return;
  }

  // ━━━ reload ━━━
  if (sub === "reload") {
    api.sendMessage("🔄 কমান্ড সিস্টেম রিলোড হচ্ছে...", threadID, async () => {
      try {
        global.client.commands.clear();
        global.client.eventRegistered = [];
        const cmdDir = path.join(process.cwd(), "Script", "commands");
        const files = fs.readdirSync(cmdDir).filter(f => f.endsWith(".js") && !f.startsWith("_"));
        let ok = 0;
        for (const file of files) {
          try {
            delete require.cache[require.resolve(path.join(cmdDir, file))];
            const cmd = require(path.join(cmdDir, file));
            if (!cmd.config?.name || !cmd.run) continue;
            if (cmd.handleEvent) global.client.eventRegistered.push(cmd.config.name);
            global.client.commands.set(cmd.config.name, cmd);
            ok++;
          } catch {}
        }
        api.sendMessage(`✅ রিলোড সম্পন্ন!\n📦 ${ok}টি কমান্ড লোড হয়েছে।`, threadID, messageID);
      } catch (e) { api.sendMessage(`❌ রিলোড ব্যর্থ: ${e.message}`, threadID, messageID); }
    });
    return;
  }

  // ━━━ maintenance ━━━
  if (sub === "maintenance") {
    const mode = args[1]?.toLowerCase();
    if (!["on", "off"].includes(mode))
      return api.sendMessage("❌ ব্যবহার: /admin maintenance on/off", threadID, messageID);
    global.config._maintenance = (mode === "on");
    api.sendMessage(
      mode === "on"
        ? "🔧 Maintenance mode চালু!\n⚠️ শুধুমাত্র মাস্টার কমান্ড ব্যবহার করতে পারবেন।"
        : "✅ Maintenance mode বন্ধ! বট স্বাভাবিকভাবে চলছে।",
      threadID, messageID
    );
    return;
  }

  // ━━━ সাহায্য ━━━
  api.sendMessage(
    `👑 Admin Master Commands:\n━━━━━━━━━━━━━━━━━━\n` +
    `• /admin kickall — সবাইকে বের করো\n` +
    `• /admin unsend — মেসেজ reply করে মুছো\n` +
    `• /admin reload — কমান্ড রিলোড করো\n` +
    `• /admin maintenance on/off — বট লক/আনলক`,
    threadID, messageID
  );
};
