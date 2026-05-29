/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▶️ youtube.js — YouTube ভিডিও ডাউনলোড
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const fs = require("fs-extra");
const path = require("path");
module.exports.config = {
  name: "youtube",
  aliases: ["yt", "ytmp4", "video"],
  version: "2.0.0",
  author: "Belal YT",
  description: "YouTube ভিডিও ডাউনলোড করে পাঠায়",
  usage: "/youtube [link বা নাম]",
  category: "📥 ডাউনলোড",
  cooldowns: 20,
  hasPermssion: 0,
};
module.exports.run = async function ({ api, event, args, input }) {
  const { threadID, messageID } = event;
  const query = input || args.join(" ");
  if (!query) return api.sendMessage("▶️ YouTube লিংক বা নাম দিন!\nউদাহরণ: /youtube Bangla song", threadID, messageID);
  const tmp = await sendTemp("⬇️ YouTube ভিডিও খুঁজছি...", api, threadID);
  try {
    const ytSearch = require("yt-search");
    let url = query;
    if (!query.includes("youtube.com") && !query.includes("youtu.be")) {
      const results = await ytSearch(query);
      url = results.videos?.[0]?.url;
      if (!url) throw new Error("ভিডিও পাওয়া যায়নি");
    }
    const ytdlExec = require("yt-dlp-exec");
    const tmpFile = path.join(process.cwd(), "tmp", `yt_${Date.now()}.mp4`);
    fs.ensureDirSync(path.dirname(tmpFile));
    await ytdlExec(url, { output: tmpFile, format: "best[filesize<50M]", noWarnings: true });
    api.unsendMessage(tmp);
    await api.sendMessage({ body: `▶️ YouTube ভিডিও\n🔗 ${url}`, attachment: fs.createReadStream(tmpFile) }, threadID, messageID);
    setTimeout(() => fs.remove(tmpFile), 60000);
  } catch (err) {
    try { api.unsendMessage(tmp); } catch {}
    api.sendMessage(`❌ ভিডিও ডাউনলোড ব্যর্থ: ${err.message}`, threadID, messageID);
  }
};
async function sendTemp(msg, api, threadID) {
  return new Promise(r => api.sendMessage(msg, threadID, (e, i) => r(i?.messageID)));
}
