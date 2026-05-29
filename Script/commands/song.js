/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎵 song.js — গান ডাউনলোড কমান্ড
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "song",
  aliases: ["music", "mp3", "গান"],
  version: "2.0.0",
  author: "Belal YT",
  description: "YouTube থেকে গান ডাউনলোড করে পাঠায়",
  usage: "/song [গানের নাম]",
  category: "🎵 মিউজিক",
  cooldowns: 15,
  hasPermssion: 0,
};

module.exports.run = async function ({ api, event, args, input }) {
  const { threadID, messageID } = event;
  const query = input || args.join(" ");
  if (!query) return api.sendMessage("🎵 গানের নাম লিখুন!\nউদাহরণ: /song তুমি আমার", threadID, messageID);

  const searching = await sendTemp(`🔍 "${query}" খুঁজছি...`, api, threadID);

  try {
    const ytSearch = require("yt-search");
    const results = await ytSearch(query);
    const video = results.videos?.[0];
    if (!video) throw new Error("গান পাওয়া যায়নি");

    const maxDuration = global.config.MODULES?.music?.maxDuration || 600;
    if (video.duration?.seconds > maxDuration)
      throw new Error(`গানটি অনেক লম্বা! সর্বোচ্চ ${maxDuration / 60} মিনিট।`);

    api.unsendMessage(searching);
    const downloading = await sendTemp(
      `⬇️ ডাউনলোড হচ্ছে...\n🎵 ${video.title}\n⏱️ দৈর্ঘ্য: ${video.timestamp}`,
      api, threadID
    );

    const tmpFile = path.join(process.cwd(), "tmp", `song_${Date.now()}.mp3`);
    fs.ensureDirSync(path.join(process.cwd(), "tmp"));

    const ytdlExec = require("yt-dlp-exec");
    await ytdlExec(video.url, {
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: tmpFile,
      noWarnings: true,
    });

    api.unsendMessage(downloading);
    await api.sendMessage({
      body: `🎵 ${video.title}\n👁️ ভিউ: ${video.views?.toLocaleString()}\n⏱️ দৈর্ঘ্য: ${video.timestamp}\n🔗 ${video.url}`,
      attachment: fs.createReadStream(tmpFile),
    }, threadID, messageID);

    setTimeout(() => fs.remove(tmpFile), 30000);
  } catch (err) {
    try { api.unsendMessage(searching); } catch {}
    api.sendMessage(`❌ গান ডাউনলোড ব্যর্থ!\n⚠️ ${err.message}`, threadID, messageID);
  }
};

async function sendTemp(msg, api, threadID) {
  return new Promise(r => api.sendMessage(msg, threadID, (e, i) => r(i?.messageID)));
}
