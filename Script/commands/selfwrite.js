/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✍️ selfwrite.js — Self-Writing Loader
  BELAL BOTX666 | Master: Belal YT
  চ্যাট থেকে নতুন কমান্ড ইনস্টল করো
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const path = require("path");
const fs = require("fs-extra");

const MASTER_ID = "100083329976451";
const CMD_DIR = path.join(process.cwd(), "Script", "commands");

module.exports.config = {
  name: "selfwrite",
  aliases: ["install", "cmdwrite", "newcmd"],
  version: "2.0.0",
  author: "Belal YT",
  description: "চ্যাট থেকে নতুন কমান্ড ফাইল তৈরি বা আপডেট করো",
  usage: "/install filename.js [কোড]",
  category: "👑 মাস্টার",
  cooldowns: 0,
  hasPermssion: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply } = event;

  // শুধুমাত্র মাস্টার ব্যবহার করতে পারবেন
  if (String(senderID) !== MASTER_ID)
    return api.sendMessage("⛔ এই কমান্ড শুধুমাত্র বট মাস্টার ব্যবহার করতে পারবেন।", threadID, messageID);

  const sub = args[0]?.toLowerCase();

  // ━━━ /install filename.js [code] ━━━
  if (!sub || sub === "help") {
    return api.sendMessage(
      `✍️ Self-Write কমান্ড সিস্টেম\n━━━━━━━━━━━━━━━━━━\n` +
      `📌 কমান্ড তৈরি:\n/install filename.js [কোড]\n\n` +
      `📌 কমান্ড মুছে ফেলা:\n/install delete filename.js\n\n` +
      `📌 কমান্ড তালিকা:\n/install list\n\n` +
      `📌 কমান্ড দেখা:\n/install view filename.js\n\n` +
      `⚠️ কোড অবশ্যই module.exports.config ও module.exports.run থাকতে হবে।`,
      threadID, messageID
    );
  }

  // ━━━ list ━━━
  if (sub === "list") {
    const files = fs.readdirSync(CMD_DIR).filter(f => f.endsWith(".js"));
    return api.sendMessage(
      `📦 মোট কমান্ড ফাইল: ${files.length}টি\n━━━━━━━━━━━━━━\n` +
      files.map((f, i) => `${i + 1}. ${f}`).join("\n"),
      threadID, messageID
    );
  }

  // ━━━ delete ━━━
  if (sub === "delete") {
    const filename = args[1];
    if (!filename?.endsWith(".js"))
      return api.sendMessage("❌ ফাইলের নাম দিন। যেমন: /install delete mycommand.js", threadID, messageID);
    const filepath = path.join(CMD_DIR, path.basename(filename));
    if (!fs.existsSync(filepath))
      return api.sendMessage(`❌ "${filename}" ফাইল পাওয়া যায়নি।`, threadID, messageID);

    // সুরক্ষিত ফাইল মুছতে দেওয়া হবে না
    const PROTECTED = ["admin.js", "guard.js", "selfwrite.js", "help.js", "index.js"];
    if (PROTECTED.includes(path.basename(filename)))
      return api.sendMessage(`🔒 "${filename}" একটি সুরক্ষিত ফাইল। মুছা যাবে না।`, threadID, messageID);

    fs.removeSync(filepath);
    delete require.cache[require.resolve(filepath)];
    global.client.commands.delete(filename.replace(".js", ""));
    return api.sendMessage(`✅ "${filename}" মুছে ফেলা হয়েছে এবং কমান্ড সিস্টেম থেকে সরানো হয়েছে।`, threadID, messageID);
  }

  // ━━━ view ━━━
  if (sub === "view") {
    const filename = args[1];
    if (!filename?.endsWith(".js"))
      return api.sendMessage("❌ ফাইলের নাম দিন। যেমন: /install view mycommand.js", threadID, messageID);
    const filepath = path.join(CMD_DIR, path.basename(filename));
    if (!fs.existsSync(filepath))
      return api.sendMessage(`❌ "${filename}" ফাইল পাওয়া যায়নি।`, threadID, messageID);
    const code = fs.readFileSync(filepath, "utf-8");
    const preview = code.length > 1000 ? code.slice(0, 1000) + "\n... (আরো আছে)" : code;
    return api.sendMessage(`📄 ${filename}:\n━━━━━━━━━━━━━━\n${preview}`, threadID, messageID);
  }

  // ━━━ install [filename.js] [code] ━━━
  const filename = args[0];
  if (!filename?.endsWith(".js"))
    return api.sendMessage("❌ ফাইলের নাম অবশ্যই .js দিয়ে শেষ হতে হবে।\nযেমন: /install mycommand.js [কোড]", threadID, messageID);

  // কোড নেওয়া — reply থেকে বা সরাসরি
  let code = args.slice(1).join(" ");
  if (!code && messageReply?.body) code = messageReply.body;

  if (!code || code.trim().length < 10)
    return api.sendMessage(
      `❌ কোড দিন!\n\nব্যবহার:\n/install mycommand.js [কোড]\n\nঅথবা কোড লেখা মেসেজটি reply করে:\n/install mycommand.js`,
      threadID, messageID
    );

  // বেসিক ভ্যালিডেশন
  if (!code.includes("module.exports.config") || !code.includes("module.exports.run"))
    return api.sendMessage(
      `❌ কোডে module.exports.config ও module.exports.run থাকতে হবে!\n\n📋 উদাহরণ কাঠামো:\nmodule.exports.config = { name: "test", ... };\nmodule.exports.run = async function({ api, event }) { ... };`,
      threadID, messageID
    );

  // বিপজ্জনক কোড চেক
  const DANGEROUS = ["process.exit", "require('child_process')", 'require("child_process")', "fs.rmSync", "fs.rmdirSync", "exec(", "execSync(", "spawn("];
  const found = DANGEROUS.find(d => code.includes(d));
  if (found)
    return api.sendMessage(`🚫 বিপজ্জনক কোড সনাক্ত হয়েছে: "${found}"\nএই ধরনের কোড ইনস্টল করা যাবে না।`, threadID, messageID);

  const safeFilename = path.basename(filename);
  const filepath = path.join(CMD_DIR, safeFilename);
  const isUpdate = fs.existsSync(filepath);

  try {
    // ফাইল লেখা
    fs.ensureDirSync(CMD_DIR);
    fs.writeFileSync(filepath, code, "utf-8");

    // require cache থেকে পুরনো ভার্সন সরানো
    try { delete require.cache[require.resolve(filepath)]; } catch {}

    // নতুন কমান্ড লোড করা
    const newCmd = require(filepath);
    if (!newCmd.config?.name)
      throw new Error("config.name পাওয়া যায়নি");

    if (newCmd.handleEvent)
      global.client.eventRegistered.push(newCmd.config.name);
    global.client.commands.set(newCmd.config.name, newCmd);

    api.sendMessage(
      `${isUpdate ? "🔄 আপডেট" : "✅ ইনস্টল"} সম্পন্ন!\n━━━━━━━━━━━━━━━━\n` +
      `📄 ফাইল: ${safeFilename}\n` +
      `🏷️ কমান্ড: /${newCmd.config.name}\n` +
      `📝 বিবরণ: ${newCmd.config.description || "নেই"}\n` +
      `✅ এখনই ব্যবহার করা যাবে!`,
      threadID, messageID
    );
  } catch (err) {
    // ভুল কোড হলে ফাইল মুছে ফেলা
    try { fs.removeSync(filepath); } catch {}
    api.sendMessage(
      `❌ ইনস্টল ব্যর্থ!\n⚠️ ত্রুটি: ${err.message}\n\n🔧 কোড চেক করুন এবং আবার চেষ্টা করুন।`,
      threadID, messageID
    );
  }
};
