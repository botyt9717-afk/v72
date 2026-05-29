/*
╔══════════════════════════════════════════════════════════════╗
║           🤖 BELAL BOTX666 — মেসেঞ্জার চ্যাটবট             ║
║        ✡️ চাঁদের পাহাড় | Master: Belal YT 🪬              ║
║              Version: 6.6.6 | Year: 2026                    ║
║         📧 mzbelalmzbelal@gmail.com                         ║
║         📞 01913246554 | 01312893012                        ║
╚══════════════════════════════════════════════════════════════╝
*/

"use strict";

const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");
const moment = require("moment-timezone");
const login = require("fca-unofficial");

const BOT_START_TIME = Date.now();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//         লগ সিস্টেম (বাংলায়)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const log = {
  info:    (msg) => console.log(chalk.cyan(`[তথ্য]    ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} ➤ ${msg}`)),
  success: (msg) => console.log(chalk.green(`[সফল]     ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} ✅ ${msg}`)),
  warn:    (msg) => console.log(chalk.yellow(`[সতর্ক]   ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} ⚠️  ${msg}`)),
  error:   (msg) => console.log(chalk.red(`[ত্রুটি]  ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} ❌ ${msg}`)),
  bot:     (msg) => console.log(chalk.magenta(`[বট]      ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} 🤖 ${msg}`)),
  cmd:     (msg) => console.log(chalk.blue(`[কমান্ড]  ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} ⚡ ${msg}`)),
  event:   (msg) => console.log(chalk.gray(`[ইভেন্ট]  ${moment().tz("Asia/Dhaka").format("HH:mm:ss")} 📡 ${msg}`)),
};
global.log = log;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           গ্লোবাল ভেরিয়েবল
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
global.client = {
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: [],
  handleReaction: [],
  handleReply: [],
  handleSchedule: [],
  mainPath: process.cwd(),
  startTime: BOT_START_TIME,
  version: "6.6.6",
};

global.data = {
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: [],
  allUserID: [],
  allCurrenciesID: [],
  allThreadID: [],
};

global.modules = {};
global.configModule = {};
global.moduleData = {};
global.temp = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           কনফিগ লোড
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadConfig() {
  try {
    const cfgPath = path.join(process.cwd(), "config.json");
    if (!fs.existsSync(cfgPath)) {
      log.error("config.json পাওয়া যায়নি! ফাইলটি তৈরি করুন।");
      process.exit(1);
    }
    global.config = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    log.success("config.json সফলভাবে লোড হয়েছে।");
  } catch (err) {
    log.error(`config.json লোড ব্যর্থ: ${err.message}`);
    log.warn("config.json ফাইলে JSON ত্রুটি আছে। ঠিক করুন।");
    process.exit(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           ভাষা ফাইল লোড
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadLanguage(lang = "bn") {
  try {
    const langPath = path.join(process.cwd(), "languages", `${lang}.lang`);
    const usePath = fs.existsSync(langPath)
      ? langPath
      : path.join(process.cwd(), "languages", "bn.lang");
    const lines = fs.readFileSync(usePath, "utf-8").split(/\r?\n/);
    global.langData = {};
    for (const line of lines.filter(l => !l.startsWith("#") && l.includes("="))) {
      const si = line.indexOf("=");
      const key = line.slice(0, si).trim();
      const value = line.slice(si + 1).replace(/\\n/g, "\n");
      const [head, ...rest] = key.split(".");
      if (!global.langData[head]) global.langData[head] = {};
      global.langData[head][rest.join(".")] = value;
    }
    global.getText = (mod, key, ...args) => {
      let text = global.langData?.[mod]?.[key] || `[${mod}.${key}]`;
      for (let i = args.length; i > 0; i--)
        text = text.replace(new RegExp(`%${i}`, "g"), args[i - 1]);
      return text;
    };
    log.success(`ভাষা ফাইল লোড: ${lang}`);
  } catch {
    global.getText = (m, k) => `[${m}.${k}]`;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//        Package auto-install
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function autoInstall(pkg, ver = "") {
  try {
    const name = ver ? `${pkg}@${ver}` : pkg;
    log.warn(`${pkg} ইন্সটল হচ্ছে...`);
    execSync(`npm install ${name} --save --legacy-peer-deps`, {
      stdio: "inherit", cwd: process.cwd(),
    });
    log.success(`${pkg} ইন্সটল সম্পন্ন।`);
  } catch {
    log.error(`${pkg} ইন্সটল ব্যর্থ।`);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//         Commands লোড
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadCommands() {
  const dir = path.join(process.cwd(), "Script", "commands");
  if (!fs.existsSync(dir)) return log.warn("Script/commands/ ফোল্ডার নেই।");
  const files = fs.readdirSync(dir).filter(f =>
    f.endsWith(".js") && !f.startsWith("_") &&
    !global.config.COMMAND_DISABLED?.includes(f.replace(".js",""))
  );
  let ok = 0, fail = 0;
  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(dir, file))];
      const cmd = require(path.join(dir, file));
      if (!cmd.config?.name || !cmd.run) { fail++; continue; }
      if (global.client.commands.has(cmd.config.name)) { fail++; continue; }
      if (cmd.config.dependencies)
        for (const [p, v] of Object.entries(cmd.config.dependencies))
          try { require(p); } catch { autoInstall(p, v); }
      if (cmd.config.envConfig) {
        global.configModule[cmd.config.name] = {};
        for (const [k, v] of Object.entries(cmd.config.envConfig))
          global.configModule[cmd.config.name][k] =
            global.config[cmd.config.name]?.[k] ?? v;
      }
      if (cmd.handleEvent) global.client.eventRegistered.push(cmd.config.name);
      global.client.commands.set(cmd.config.name, cmd);
      ok++;
    } catch (err) {
      log.error(`কমান্ড [${file}] লোড ব্যর্থ: ${err.message}`);
      fail++;
    }
  }
  log.success(`${ok}টি কমান্ড লোড | ${fail}টি ব্যর্থ`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//          Events লোড
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadEvents() {
  const dir = path.join(process.cwd(), "Script", "events");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f =>
    f.endsWith(".js") && !f.startsWith("_") &&
    !global.config.EVENT_DISABLED?.includes(f.replace(".js",""))
  );
  let ok = 0;
  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(dir, file))];
      const evt = require(path.join(dir, file));
      if (!evt.config?.name || !evt.handleEvent) continue;
      global.client.events.set(evt.config.name, evt);
      ok++;
    } catch (err) {
      log.error(`ইভেন্ট [${file}] লোড ব্যর্থ: ${err.message}`);
    }
  }
  log.success(`${ok}টি ইভেন্ট লোড হয়েছে।`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//         Appstate লোড
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadAppstate() {
  const p = path.resolve(process.cwd(), global.config.APPSTATEPATH || "appstate.json");
  if (!fs.existsSync(p)) {
    log.error("appstate.json পাওয়া যায়নি! Facebook cookie যোগ করুন।");
    process.exit(1);
  }
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf-8"));
    if (!Array.isArray(data) || !data.length) {
      log.error("appstate.json ভুল বা খালি! নতুন cookie দিন।");
      process.exit(1);
    }
    log.success("Facebook appstate লোড সফল।");
    return data;
  } catch {
    log.error("appstate.json পড়তে সমস্যা হয়েছে।");
    process.exit(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//          Database সংযোগ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function connectDatabase() {
  const { sequelize, Sequelize } = require("./includes/database");
  await sequelize.authenticate();
  log.success("Database সংযোগ সফল।");
  const models = require("./includes/database/model")({ Sequelize, sequelize });
  await sequelize.sync({ alter: false });
  log.success("Database টেবিল প্রস্তুত।");
  return models;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       Database ডেটা লোড
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function loadDBData(models) {
  const { Users, Threads, Currencies } = models;
  const threads = await Threads.getAll();
  for (const t of threads) {
    const tid = String(t.threadID);
    global.data.allThreadID.push(tid);
    if (t.data) global.data.threadData.set(tid, t.data);
    if (t.data?.banned)
      global.data.threadBanned.set(tid, { reason: t.data.banned.reason || "", dateAdded: t.data.banned.dateAdded || "" });
  }
  const users = await Users.getAll(["userID", "banned", "data"]);
  for (const u of users) {
    const uid = String(u.userID);
    global.data.allUserID.push(uid);
    if (u.data) global.data.userName.set(uid, u.data);
    if (u.banned?.status)
      global.data.userBanned.set(uid, { reason: u.banned.reason || "", dateAdded: u.banned.dateAdded || "" });
  }
  const currs = await Currencies.getAll(["userID"]);
  for (const c of currs) global.data.allCurrenciesID.push(String(c.userID));
  log.success(`${threads.length}টি গ্রুপ, ${users.length}জন ইউজার লোড।`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//        Crash Log সংরক্ষণ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function saveCrashLog(type, err) {
  try {
    if (!global.config?.SYSTEM?.saveCrashLogs) return;
    const dir = path.join(process.cwd(), "logs");
    fs.ensureDirSync(dir);
    fs.writeFileSync(
      path.join(dir, `crash_${Date.now()}.log`),
      `সময়: ${moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\nধরন: ${type}\n${err?.stack || err}\n`
    );
  } catch {}
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       Express server (alive)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setupExpress() {
  try {
    const express = require("express");
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.get("/", (_, res) => res.json({
      name: "BELAL BOTX666", version: "6.6.6", status: "🟢 চলছে",
      master: "Belal YT", uptime: Math.floor((Date.now() - BOT_START_TIME) / 1000) + "s",
      commands: global.client.commands.size, events: global.client.events.size,
      time: moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss"),
    }));
    app.get("/ping", (_, res) => res.send("🏓 বট সক্রিয়!"));
    app.listen(PORT, () => log.success(`Express server চালু: port ${PORT}`));
  } catch (e) { log.warn(`Express server চালু হয়নি: ${e.message}`); }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           বট চালু করা
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function startBot(models) {
  const appstate = loadAppstate();
  const { Users, Threads, Currencies } = models;
  log.info("Facebook লগইন হচ্ছে...");

  login({ appState: appstate, ...global.config.FCAOption }, async (err, api) => {
    if (err) {
      log.error(`লগইন ব্যর্থ: ${JSON.stringify(err)}`);
      log.warn("appstate.json পুরনো হতে পারে। নতুন cookie দিন।");
      return;
    }

    try {
      fs.writeFileSync(
        path.resolve(process.cwd(), global.config.APPSTATEPATH || "appstate.json"),
        JSON.stringify(api.getAppState(), null, 2)
      );
    } catch {}

    api.setOptions(global.config.FCAOption || {});
    global.client.api = api;
    global.config.botID = api.getCurrentUserID();
    log.success(`লগইন সফল! Bot UID: ${global.config.botID}`);

    await loadDBData(models);
    setupExpress();

    const opts = { api, models, Users, Threads, Currencies };
    const handleCommand  = require("./includes/handle/handleCommand")(opts);
    const handleEvent    = require("./includes/handle/handleEvent")(opts);
    const handleReaction = require("./includes/handle/handleReaction")(opts);
    const handleReply    = require("./includes/handle/handleReply")(opts);

    log.bot(`✅ ${global.client.commands.size} কমান্ড | ${global.client.events.size} ইভেন্ট সক্রিয়`);
    log.bot(`বট চলছে — ${moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}`);

    api.listenMqtt(async (err, event) => {
      if (err) return log.error(`Listener ত্রুটি: ${err}`);
      try {
        switch (event.type) {
          case "message":
          case "message_reply":
          case "message_unsend":
            await handleCommand({ event });
            handleEvent({ event });
            handleReply({ event });
            break;
          case "event":
            handleEvent({ event });
            break;
          case "message_reaction":
            handleReaction({ event });
            break;
          default:
            handleEvent({ event });
        }
      } catch (e) { log.error(`প্রসেস ত্রুটি: ${e.message}`); }
    });

    if (global.config.SYSTEM?.autoRestart && global.config.SYSTEM?.restartInterval)
      setTimeout(() => { log.warn("নির্ধারিত সময়ে পুনরায় চালু হচ্ছে..."); process.exit(0); },
        global.config.SYSTEM.restartInterval * 1000);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           মূল প্রবেশ বিন্দু
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function main() {
  const dirs = [
    "Script/commands","Script/events","Script/events/cache/joinGif",
    "Script/events/leaveGif","includes/database/models","includes/handle",
    "includes/controllers","languages","logs","backup","utils","assets",
  ];
  for (const d of dirs) fs.ensureDirSync(path.join(process.cwd(), d));

  process.on("unhandledRejection", (r) => { log.error(`অপ্রত্যাশিত: ${r}`); saveCrashLog("rejection", r); });
  process.on("uncaughtException", (e) => { log.error(`Exception: ${e.message}`); saveCrashLog("exception", e); });

  loadConfig();
  loadLanguage(global.config.LANGUAGE || "bn");
  loadCommands();
  loadEvents();

  let models;
  try { models = await connectDatabase(); }
  catch (e) { log.error(`Database সমস্যা: ${e.message}`); process.exit(1); }

  await startBot(models);
}

main().catch(e => { log.error(`বট চালু হয়নি: ${e.message}`); process.exit(1); });
