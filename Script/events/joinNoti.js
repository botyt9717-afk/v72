/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 joinNoti.js — নতুন সদস্য ওয়েলকাম
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "2.0.0",
  description: "নতুন সদস্য যোগ হলে ওয়েলকাম ভিডিও ও বার্তা পাঠায়",
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
  try {
    const { logMessageData, threadID, logMessageType } = event;
    if (logMessageType !== "log:subscribe") return;

    const { ADMINBOT, GROUP_SETTINGS, config: botConfig } = global.config;
    const threadData = global.data.threadData.get(String(threadID)) || {};
    if (!threadData.welcomeEnabled && threadData.welcomeEnabled !== undefined) return;

    const addedIDs = logMessageData?.addedParticipants?.map(p => String(p.userID)) || [];
    if (!addedIDs.length) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const memberCount = threadInfo?.participantIDs?.length || 0;
    const threadName = threadInfo?.name || "এই গ্রুপে";

    for (const uid of addedIDs) {
      try {
        // বট নিজে জয়েন হলে
        if (uid === String(api.getCurrentUserID())) {
          await api.sendMessage(
            `╔══════════════════════════╗\n` +
            `║  🤖 BELAL BOTX666 এসেছি! ║\n` +
            `╚══════════════════════════╝\n\n` +
            `✡️ চাঁদের পাহাড় | Master: Belal YT\n` +
            `📋 কমান্ড দেখতে /help লিখুন\n` +
            `📞 যোগাযোগ: 01913246554`,
            threadID
          );
          continue;
        }

        const userName = await getUserName(api, uid);

        // welcome ভিডিও পাঠানো
        const gifDir = path.join(process.cwd(), "Script", "events", "cache", "joinGif");
        if (fs.existsSync(gifDir)) {
          const vids = fs.readdirSync(gifDir).filter(f =>
            f.endsWith(".mp4") || f.endsWith(".gif")
          );
          if (vids.length > 0) {
            const randomVid = vids[Math.floor(Math.random() * vids.length)];
            const vidPath = path.join(gifDir, randomVid);
            await api.sendMessage({
              body: `🎉 স্বাগতম ${userName}!\n🏠 গ্রুপ: ${threadName}\n👥 মোট সদস্য: ${memberCount} জন\n\n🤖 আমি BELAL BOTX666\n📋 কমান্ড দেখতে /help লিখুন।`,
              attachment: fs.createReadStream(vidPath),
            }, threadID);
            continue;
          }
        }

        // ভিডিও না থাকলে শুধু মেসেজ
        await api.sendMessage(
          `🎉 স্বাগতম ${userName}!\n🏠 গ্রুপ: ${threadName}\n👥 মোট সদস্য: ${memberCount} জন\n\n🤖 আমি BELAL BOTX666\n📋 কমান্ড দেখতে /help লিখুন।`,
          threadID
        );
      } catch (e) {
        global.log.error(`joinNoti ব্যক্তিগত ত্রুটি [${uid}]: ${e.message}`);
      }
    }
  } catch (err) {
    global.log.error(`joinNoti ত্রুটি: ${err.message}`);
  }
};

async function getUserName(api, uid) {
  try {
    const info = await api.getUserInfo(uid);
    return info?.[uid]?.name || uid;
  } catch { return uid; }
}
