"use strict";
module.exports.config = {
  name: "ping",
  aliases: ["speed", "পিং"],
  version: "1.0.0",
  author: "Belal YT",
  description: "বটের গতি ও অবস্থা দেখায়",
  usage: "/ping",
  category: "⚙️ সিস্টেম",
  cooldowns: 3,
  hasPermssion: 0,
};
module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const start = Date.now();
  api.sendMessage("🏓 পরীক্ষা করছি...", threadID, async (err, info) => {
    const ping = Date.now() - start;
    const uptime = Math.floor((Date.now() - global.client.startTime) / 1000);
    const h = Math.floor(uptime / 3600), m = Math.floor((uptime % 3600) / 60), s = uptime % 60;
    const used = process.memoryUsage();
    api.unsendMessage(info.messageID);
    api.sendMessage(
      `🏓 BELAL BOTX666 — সিস্টেম তথ্য\n━━━━━━━━━━━━━━━━━━\n` +
      `⚡ পিং: ${ping}ms\n` +
      `⏱️ আপটাইম: ${h}ঘ ${m}মি ${s}সে\n` +
      `🤖 কমান্ড: ${global.client.commands.size}টি\n` +
      `📡 ইভেন্ট: ${global.client.events.size}টি\n` +
      `💾 মেমোরি: ${(used.heapUsed / 1024 / 1024).toFixed(2)}MB\n` +
      `🟢 অবস্থা: সক্রিয়`,
      threadID, messageID
    );
  });
};
