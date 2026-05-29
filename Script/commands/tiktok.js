/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎵 tiktok.js — TikTok ভিডিও ডাউনলোড
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
module.exports.config = {
  name: "tiktok",
  aliases: ["tt", "tikdown"],
  version: "2.0.0",
  author: "Belal YT",
  description: "TikTok ভিডিও watermark ছাড়া ডাউনলোড",
  usage: "/tiktok [link]",
  category: "📥 ডাউনলোড",
  cooldowns: 15,
  hasPermssion: 0,
};
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const url = args[0];
  if (!url || !url.includes("tiktok")) return api.sendMessage("❌ TikTok লিংক দিন!\nউদাহরণ: /tiktok https://vm.tiktok.com/xxx", threadID, messageID);
  const tmp = await sendTemp("⬇️ TikTok ভিডিও ডাউনলোড হচ্ছে...", api, threadID);
  try {
    const res = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = res.data?.data;
    if (!data) throw new Error("ভিডিও পাওয়া যায়নি");
    const vidRes = await axios.get(data.play, { responseType: "arraybuffer" });
    const tmpFile = path.join(process.cwd(), "tmp", `tt_${Date.now()}.mp4`);
    fs.ensureDirSync(path.dirname(tmpFile));
    fs.writeFileSync(tmpFile, vidRes.data);
    api.unsendMessage(tmp);
    await api.sendMessage({
      body: `🎵 ${data.title || "TikTok ভিডিও"}\n❤️ লাইক: ${data.digg_count?.toLocaleString()}\n💬 কমেন্ট: ${data.comment_count?.toLocaleString()}`,
      attachment: fs.createReadStream(tmpFile),
    }, threadID, messageID);
    setTimeout(() => fs.remove(tmpFile), 30000);
  } catch (err) {
    try { api.unsendMessage(tmp); } catch {}
    api.sendMessage(`❌ ডাউনলোড ব্যর্থ: ${err.message}`, threadID, messageID);
  }
};
async function sendTemp(msg, api, threadID) {
  return new Promise(r => api.sendMessage(msg, threadID, (e, i) => r(i?.messageID)));
}
