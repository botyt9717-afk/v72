/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 antiOut.js — বট বের হওয়া রোধ
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
module.exports.config = {
  name: "antiOut",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  description: "বটকে গ্রুপ থেকে বের করার চেষ্টা রোধ করে",
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { logMessageData, threadID, author } = event;
    if (event.logMessageType !== "log:unsubscribe") return;
    const leftID = String(logMessageData?.leftParticipantFbId);
    if (leftID !== String(api.getCurrentUserID())) return;

    const { ADMINBOT, NDH } = global.config;
    const authorStr = String(author);
    if (ADMINBOT.includes(authorStr) || NDH?.includes(authorStr)) return;

    const threadData = global.data.threadData.get(String(threadID)) || {};
    if (!threadData.antiOut) return;

    await api.addUserToGroup(api.getCurrentUserID(), threadID);
    const name = await getUserName(api, authorStr);
    await api.sendMessage(
      `⚠️ ${name} বটকে বের করার চেষ্টা করেছে!\n🔒 বট স্বয়ংক্রিয়ভাবে ফিরে এসেছে।`,
      threadID
    );
  } catch (err) {
    global.log.error(`antiOut ত্রুটি: ${err.message}`);
  }
};

async function getUserName(api, uid) {
  try { const i = await api.getUserInfo(uid); return i?.[uid]?.name || uid; } catch { return uid; }
}
  
