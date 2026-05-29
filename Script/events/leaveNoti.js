/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 leaveNoti.js — সদস্য চলে গেলে বিদায়
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  description: "সদস্য চলে গেলে বিদায় বার্তা পাঠায়",
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { logMessageData, threadID, logMessageType, author } = event;
    if (logMessageType !== "log:unsubscribe") return;

    const threadData = global.data.threadData.get(String(threadID)) || {};
    if (threadData.leaveNotiEnabled === false) return;

    const leftID = String(logMessageData?.leftParticipantFbId);
    if (!leftID || leftID === "undefined") return;
    if (leftID === String(api.getCurrentUserID())) return;

    const userName = await getUserName(api, leftID);
    const kickedByName = author && author !== leftID ? await getUserName(api, author) : null;

    const leaveDir = path.join(process.cwd(), "Script", "events", "leaveGif");
    const gifs = fs.existsSync(leaveDir)
      ? fs.readdirSync(leaveDir).filter(f => f.endsWith(".gif") || f.endsWith(".mp4"))
      : [];

    const msg = kickedByName
      ? `👢 ${userName} কে গ্রুপ থেকে বের করা হয়েছে!\n👮 বের করেছেন: ${kickedByName}`
      : `👋 বিদায় ${userName}!\n😢 তোমাকে মিস করব আমরা।`;

    if (gifs.length > 0) {
      const gifPath = path.join(leaveDir, gifs[Math.floor(Math.random() * gifs.length)]);
      await api.sendMessage({ body: msg, attachment: fs.createReadStream(gifPath) }, threadID);
    } else {
      await api.sendMessage(msg, threadID);
    }
  } catch (err) {
    global.log.error(`leaveNoti ত্রুটি: ${err.message}`);
  }
};

async function getUserName(api, uid) {
  try {
    const info = await api.getUserInfo(uid);
    return info?.[uid]?.name || uid;
  } catch { return uid; }
}
