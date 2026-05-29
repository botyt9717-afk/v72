/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🤖 BELAL BOTX666 — Command Handler
  সব কমান্ড এখান থেকে প্রসেস হয়
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

"use strict";

const stringSimilarity = require("string-similarity");
const moment = require("moment-timezone");

module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return async function ({ event }) {
    const now = Date.now();
    const time = moment().tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

    const {
      PREFIX, ADMINBOT, NDH, COMMAND_DISABLED,
      SYSTEM, COOLDOWNS, GROUP_SETTINGS, BOT_MODES,
    } = global.config;

    const { userBanned, threadBanned, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;

    let { body, senderID, threadID, messageID, isGroup } = event;
    senderID = String(senderID);
    threadID = String(threadID);

    if (!body) return;

    // ━━━ Thread সেটিং থেকে prefix নেওয়া ━━━
    const threadSetting = threadData.get(threadID) || {};
    const threadPrefix = threadSetting.PREFIX || PREFIX || "/";
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^${escapeRegex(threadPrefix)}\\s*`);

    // ━━━ No-prefix মোড ━━━
    const noPrefix = BOT_MODES?.noPrefix || threadSetting?.noPrefix || false;
    if (!noPrefix && !prefixRegex.test(body)) return;

    // ━━━ Inbox অনুমতি চেক ━━━
    if (!isGroup && !GROUP_SETTINGS?.allowInbox && !ADMINBOT.includes(senderID)) return;

    // ━━━ Admin-only মোড ━━━
    if (GROUP_SETTINGS?.adminOnly && !ADMINBOT.includes(senderID))
      return api.sendMessage("⛔ শুধুমাত্র বট অ্যাডমিন ব্যবহার করতে পারবেন।", threadID, messageID);

    // ━━━ Ban চেক ━━━
    if (!ADMINBOT.includes(senderID)) {
      if (userBanned.has(senderID)) {
        const { reason, dateAdded } = userBanned.get(senderID);
        return api.sendMessage(
          `🚫 আপনি ব্যান হয়েছেন!\n📅 তারিখ: ${dateAdded}\n📝 কারণ: ${reason}\n\n📞 যোগাযোগ: 01913246554`,
          threadID, messageID
        );
      }
      if (threadBanned.has(threadID)) {
        const { reason, dateAdded } = threadBanned.get(threadID);
        return api.sendMessage(
          `🚫 এই গ্রুপ ব্যান হয়েছে!\n📅 তারিখ: ${dateAdded}\n📝 কারণ: ${reason}`,
          threadID, messageID
        );
      }
    }

    // ━━━ Command extract ━━━
    const matchedPrefix = noPrefix ? "" : (body.match(prefixRegex)?.[0] || "");
    const args = body.slice(matchedPrefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const input = args.join(" ");

    if (!commandName) return;

    // ━━━ Command খোঁজা ━━━
    let command = commands.get(commandName);
    if (!command) {
      const allNames = [...commands.keys()];
      const best = stringSimilarity.findBestMatch(commandName, allNames);
      if (best.bestMatch.rating >= 0.6) {
        command = commands.get(best.bestMatch.target);
      } else {
        return api.sendMessage(
          `❓ "${commandName}" কমান্ড পাওয়া যায়নি।\n💡 কাছাকাছি: ${best.bestMatch.target}\n📋 সব কমান্ড: ${threadPrefix}help`,
          threadID, messageID
        );
      }
    }

    // ━━━ Command disabled চেক ━━━
    if (COMMAND_DISABLED?.includes(command.config.name)) {
      return api.sendMessage(`⛔ "${command.config.name}" কমান্ড বর্তমানে বন্ধ আছে।`, threadID, messageID);
    }

    // ━━━ Command ban চেক ━━━
    if (!ADMINBOT.includes(senderID) && commandBanned.has(threadID)) {
      const banned = commandBanned.get(threadID) || [];
      if (banned.includes(command.config.name))
        return api.sendMessage(`⛔ এই গ্রুপে "${command.config.name}" কমান্ড নিষিদ্ধ।`, threadID, messageID);
    }

    // ━━━ Permission চেক ━━━
    let permission = 0;
    if (ADMINBOT.includes(senderID)) permission = 3;
    else if (NDH?.includes(senderID)) permission = 2;
    else {
      try {
        const threadInfo = await Threads.getInfo(threadID);
        const isAdmin = threadInfo?.adminIDs?.some(a => a.id === senderID);
        if (isAdmin) permission = 1;
      } catch {}
    }

    const required = command.config.hasPermssion || command.config.permission || 0;
    if (required > permission) {
      const permText = { 1: "গ্রুপ অ্যাডমিন", 2: "সাপোর্ট", 3: "বট অ্যাডমিন" };
      return api.sendMessage(
        `🔐 এই কমান্ড ব্যবহার করতে ${permText[required] || "উচ্চতর"} অনুমতি লাগবে।`,
        threadID, messageID
      );
    }

    // ━━━ Cooldown চেক ━━━
    const cooldownTime = (command.config.cooldowns ?? COOLDOWNS?.default ?? 3) * 1000;
    if (cooldownTime > 0 && !ADMINBOT.includes(senderID)) {
      if (!cooldowns.has(command.config.name)) cooldowns.set(command.config.name, new Map());
      const timestamps = cooldowns.get(command.config.name);
      const lastUsed = timestamps.get(senderID);
      if (lastUsed && now < lastUsed + cooldownTime) {
        const remaining = ((lastUsed + cooldownTime - now) / 1000).toFixed(1);
        return api.sendMessage(
          `⏳ একটু অপেক্ষা করুন!\n⏱️ ${remaining} সেকেন্ড পরে আবার চেষ্টা করুন।`,
          threadID, messageID
        );
      }
      timestamps.set(senderID, now);
    }

    // ━━━ Command getText ━━━
    let getText2 = () => "";
    if (command.languages?.[global.config.LANGUAGE]) {
      getText2 = (key, ...vals) => {
        let text = command.languages[global.config.LANGUAGE][key] || "";
        for (let i = vals.length; i > 0; i--)
          text = text.replace(new RegExp(`%${i}`, "g"), vals[i - 1]);
        return text;
      };
    }

    // ━━━ Command চালানো ━━━
    try {
      await command.run({
        api, event, args, input,
        models, Users, Threads, Currencies,
        permission, getText: getText2,
        prefix: threadPrefix,
        botID: global.config.botID,
        config: global.config,
        data: global.data,
        client: global.client,
      });

      if (SYSTEM?.developerMode) {
        global.log.cmd(`[DEV] ${time} | ${commandName} | ${senderID} | ${threadID} | ${input}`);
      }
    } catch (err) {
      global.log.error(`কমান্ড [${command.config.name}] ত্রুটি: ${err.message}`);
      api.sendMessage(
        `❌ কমান্ড চালাতে সমস্যা হয়েছে!\n🔧 কমান্ড: ${command.config.name}\n📛 ত্রুটি: ${err.message}`,
        threadID, messageID
      );
    }
  };
};
        
