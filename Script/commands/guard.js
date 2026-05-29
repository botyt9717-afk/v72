/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🛡️ guard.js — Group Security Engine
  BELAL BOTX666 | Master: Belal YT
  Anti-Spam + Anti-Link Protection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";

const spamTracker = new Map();
const warnCount = new Map();

// ━━━ নিষিদ্ধ লিংক প্যাটার্ন ━━━
const BLOCKED_LINKS = [
  /bit\.ly/i, /tinyurl\.com/i, /shorturl\.at/i,
  /discord\.gg/i, /t\.me\//i,
  /join\.skype/i, /wa\.me\//i,
];

module.exports.config = {
  name: "guard",
  aliases: ["security", "protect"],
  version: "2.0.0",
  author: "Belal YT",
  description: "গ্রুপ সুরক্ষা — anti-spam ও anti-link সিস্টেম",
  usage: "/guard [on/off/status]",
  category: "🛡️ নিরাপত্তা",
  cooldowns: 5,
  hasPermssion: 1,
};

// ━━━ কমান্ড দিয়ে চালু/বন্ধ ━━━
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = args[0]?.toLowerCase();
  const threadData = global.data.threadData.get(String(threadID)) || {};

  if (sub === "on") {
    threadData.guardEnabled = true;
    global.data.threadData.set(String(threadID), threadData);
    return api.sendMessage(
      `🛡️ Guard সিস্টেম চালু!\n━━━━━━━━━━━━━━━━\n✅ Anti-Spam: সক্রিয়\n✅ Anti-Link: সক্রিয়\n⚙️ ৩ সেকেন্ডে ৫+ মেসেজ = কিক\n⚙️ নিষিদ্ধ লিংক = সতর্ক → কিক`,
      threadID, messageID
    );
  }

  if (sub === "off") {
    threadData.guardEnabled = false;
    global.data.threadData.set(String(threadID), threadData);
    return api.sendMessage("🔓 Guard সিস্টেম বন্ধ করা হয়েছে।", threadID, messageID);
  }

  const status = threadData.guardEnabled ? "🟢 চালু" : "🔴 বন্ধ";
  api.sendMessage(
    `🛡️ Guard সিস্টেম — অবস্থা: ${status}\n━━━━━━━━━━━━━━━━\n• /guard on — চালু করো\n• /guard off — বন্ধ করো`,
    threadID, messageID
  );
};

// ━━━ সব মেসেজ মনিটর করা ━━━
module.exports.handleEvent = async function ({ api, event }) {
  if (event.type !== "message") return;
  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const sid = String(senderID);
  const tid = String(threadID);
  const { ADMINBOT, NDH } = global.config;

  // অ্যাডমিন ও মাস্টার বাদ
  if (ADMINBOT.includes(sid) || NDH?.includes(sid)) return;

  const threadData = global.data.threadData.get(tid) || {};
  if (!threadData.guardEnabled) return;

  // ━━━ Anti-Link চেক ━━━
  const hasBlockedLink = BLOCKED_LINKS.some(p => p.test(body));
  if (hasBlockedLink) {
    try { await api.unsendMessage(messageID); } catch {}

    const key = `link_${tid}_${sid}`;
    const count = (warnCount.get(key) || 0) + 1;
    warnCount.set(key, count);

    if (count >= 2) {
      warnCount.delete(key);
      try { await api.removeUserFromGroup(sid, tid); } catch {}
      const name = await getName(api, sid);
      return api.sendMessage(
        `🚫 ${name} কে নিষিদ্ধ লিংক পাঠানোর কারণে গ্রুপ থেকে বের করা হয়েছে!`,
        tid
      );
    }

    const name = await getName(api, sid);
    return api.sendMessage(
      `⚠️ ${name}, নিষিদ্ধ লিংক পাঠানো যাবে না!\n🔢 সতর্কতা: ${count}/2\n❌ আরেকবার করলে kick করা হবে।`,
      tid
    );
  }

  // ━━━ Anti-Spam চেক ━━━
  const now = Date.now();
  const spamKey = `${tid}_${sid}`;
  const tracker = spamTracker.get(spamKey) || { msgs: [], warned: false };

  tracker.msgs.push(now);
  tracker.msgs = tracker.msgs.filter(t => now - t < 3000); // ৩ সেকেন্ডের উইন্ডো
  spamTracker.set(spamKey, tracker);

  if (tracker.msgs.length >= 5) {
    if (!tracker.warned) {
      tracker.warned = true;
      spamTracker.set(spamKey, tracker);
      const name = await getName(api, sid);
      await api.sendMessage(
        `⚠️ ${name}, স্প্যাম করা বন্ধ করুন!\n🔴 ১০ সেকেন্ডের মধ্যে বন্ধ না করলে kick করা হবে।`,
        tid
      );
      // ১০ সেকেন্ড পরেও স্প্যাম চলতে থাকলে kick
      setTimeout(async () => {
        const current = spamTracker.get(spamKey);
        if (current?.msgs?.filter(t => Date.now() - t < 3000).length >= 3) {
          spamTracker.delete(spamKey);
          try { await api.removeUserFromGroup(sid, tid); } catch {}
          const n = await getName(api, sid);
          api.sendMessage(`🚫 ${n} কে অতিরিক্ত স্প্যামের কারণে kick করা হয়েছে!`, tid);
        } else {
          spamTracker.delete(spamKey);
        }
      }, 10000);
    }
  }
};

async function getName(api, uid) {
  try {
    const info = await api.getUserInfo(uid);
    return info?.[uid]?.name || uid;
  } catch { return uid; }
}
