/*
╔══════════════════════════════════════════════════════════════╗
║           🤖 BELAL BOTX666 — Messenger Chatbot             ║
║        ✡️ চাঁদের পাহাড় | Master: Belal YT 🪬              ║
║              Version: 6.6.6 | Year: 2026                    ║
║         📧 mzbelalmzbelal@gmail.com                         ║
║         📞 01913246554 | 01312893012                        ║
╚══════════════════════════════════════════════════════════════╝
*/

"use strict";

const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment-timezone");
const login = require("fca-unofficial");

// utils ফোল্ডারের log.js ফাইলটিকে যুক্ত করা হলো
const log = require("./utils/log");
global.log = log;

const BOT_START_TIME = Date.now();

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
      const value = line.slice(si + 1).trim();
      global.langData[key] = value;
    }
    log.success(`ভাষা ফাইল [${path.basename(usePath)}] লোড সম্পন্ন হয়েছে।`);
  } catch (err) {
    log.error(`ভাষা ফাইল লোড ব্যর্থ: ${err.message}`);
  }
}

function getText(key, ...args) {
  let text = global.langData[key] || key;
  for (let i = 0; i < args.length; i++) {
    text = text.replace(new RegExp(`%${i + 1}`, "g"), args[i]);
  }
  return text;
}
global.getText = getText;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//         কমান্ড ও ইভেন্ট লোডার
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadCommands() {
  const cmdDir = path.join(process.cwd(), "Script", "commands");
  if (!fs.existsSync(cmdDir)) return log.warn("কমান্ড ডিরেক্টরি পাওয়া যায়নি।");
  const files = fs.readdirSync(cmdDir).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmd = require(path.join(cmdDir, file));
      if (!cmd.config || !cmd.run || !cmd.config.name) continue;
      global.client.commands.set(cmd.config.name, cmd);
      if (cmd.handleEvent) global.client.eventRegistered.push(cmd.config.name);
    } catch (e) {
      log.error(`কমান্ড ফাইল লোড ব্যর্থ [${file}]: ${e.message}`);
    }
  }
  log.success(`${global.client.commands.size}টি কমান্ড সফলভাবে ইঞ্জিন লোড করেছে।`);
}

function loadEvents() {
  const evtDir = path.join(process.cwd(), "Script", "events");
  if (!fs.existsSync(evtDir)) return log.warn("ইভেন্ট ডিরেক্টরি পাওয়া যায়নি।");
  const files = fs.readdirSync(evtDir).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const evt = require(path.join(evtDir, file));
      if (!evt.config || !evt.handleEvent || !evt.config.name) continue;
      global.client.events.set(evt.config.name, evt);
    } catch (e) {
      log.error(`ইভেন্ট ফাইল লোড ব্যর্থ [${file}]: ${e.message}`);
    }
  }
  log.success(`${global.client.events.size}টিシステム ইভেন্ট লোড সম্পন্ন হয়েছে।`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//    ডেটাবেস কানেকশন এবং ইন-লাইন মডেল স্কিমা
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function connectDatabase() {
  try {
    const dbIndex = path.join(process.cwd(), "includes", "database", "index.js");
    if (!fs.existsSync(dbIndex)) throw new Error("database/index.js ফাইলটি অনুপস্থিত।");
    const { sequelize, Sequelize } = require(dbIndex);
    await sequelize.authenticate();
    log.success("SQLite ডেটাবেস সফলভাবে সংযুক্ত হয়েছে।");
    
    // বাইরের ক্র্যাশ এড়াতে মডেলগুলো এখানেই ডিফাইন করা হলো
    const { DataTypes } = Sequelize;
    const Users = sequelize.define("Users", {
      userID: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      vanilla: { type: DataTypes.TEXT },
      exp: { type: DataTypes.INTEGER, defaultValue: 0 },
      money: { type: DataTypes.INTEGER, defaultValue: 0 },
      banned: { type: DataTypes.BOOLEAN, defaultValue: false },
      reason: { type: DataTypes.TEXT },
      data: { type: DataTypes.TEXT, defaultValue: "{}" }
    });

    const Threads = sequelize.define("Threads", {
      threadID: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      threadInfo: { type: DataTypes.TEXT, defaultValue: "{}" },
      threadData: { type: DataTypes.TEXT, defaultValue: "{}" },
      banned: { type: DataTypes.BOOLEAN, defaultValue: false },
      reason: { type: DataTypes.TEXT },
      data: { type: DataTypes.TEXT, defaultValue: "{}" }
    });

    const Currencies = sequelize.define("Currencies", {
      userID: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      money: { type: DataTypes.INTEGER, defaultValue: 0 },
      data: { type: DataTypes.TEXT, defaultValue: "{}" }
    });

    const models = { Users, Threads, Currencies };
    global.data.models = models;
    log.success("ডেটাবেস টেবিল প্রস্তুত ও মডেল লোড সম্পন্ন হয়েছে।");
    return models;
  } catch (err) {
    log.error(`ডেটাবেস সংযোগে মারাত্মক ত্রুটি: ${err.message}`);
    throw err;
  }
}

function saveCrashLog(type, error) {
  try {
    const logPath = path.join(process.cwd(), "logs", `crash-${type}-${Date.now()}.txt`);
    fs.outputFileSync(logPath, error.stack || error.toString());
  } catch {}
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           লিসেনিং ও মেইন প্রসেস
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function startBot(models) {
  const appStatePath = path.join(process.cwd(), global.config.APPSTATEPATH || "appstate.json");
  if (!fs.existsSync(appStatePath)) {
    log.error("appstate.json পাওয়া যায়নি! বট চালু করা সম্ভব নয়।");
    process.exit(1);
  }

  const appState = JSON.parse(fs.readFileSync(appStatePath, "utf-8"));
  
  log.info("ফেসবুক সার্ভারের সাথে সংযোগ স্থাপন করা হচ্ছে...");
  login({ appState }, (err, api) => {
    if (err) {
      log.error(`ফেসবুক লগইন ব্যর্থ হয়েছে: ${JSON.stringify(err)}`);
      process.exit(1);
    }

    global.client.api = api;
    api.setOptions(global.config.FCAOption || { listenEvents: true, selfListen: false });
    log.success(`BELAL BOTX666 চ্যাটবট সফলভাবে অনলাইন হয়েছে! UID: ${api.getCurrentUserID()}`);

    const handleCommand = require(path.join(process.cwd(), "handleCommand"))({
      api, models, Users: models.Users, Threads: models.Threads, Currencies: models.Currencies
    });
    const handleEvent = require(path.join(process.cwd(), "handleEvent"))({
      api, models, Users: models.Users, Threads: models.Threads, Currencies: models.Currencies
    });
    const handleReply = require(path.join(process.cwd(), "handleReply"))({
      api, models, Users: models.Users, Threads: models.Threads, Currencies: models.Currencies
    });
    const handleReaction = require(path.join(process.cwd(), "handleReaction"))({
      api, models, Users: models.Users, Threads: models.Threads, Currencies: models.Currencies
    });

    api.listenMqtt((error, event) => {
      if (error) {
        log.error(`MQTT লিসেনিং ত্রুটি: ${error.message}`);
        return;
      }

      try {
        switch (event.type) {
          case "message":
          case "message_reply":
            handleCommand({ event });
            handleReply({ event });
            break;
          case "message_reaction":
            handleReaction({ event });
            break;
          default:
            handleEvent({ event });
        }
      } catch (e) { 
        log.error(`প্রসেস ত্রুটি: ${e.message}`); 
      }
    });

    if (global.config.SYSTEM?.autoRestart && global.config.SYSTEM?.restartInterval) {
      setTimeout(() => { 
        log.warn("নির্ধারিত সময়ে পুনরায় চালু হচ্ছে..."); 
        process.exit(0); 
      }, global.config.SYSTEM.restartInterval * 1000);
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           মূল প্রবেশ বিন্দু
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function main() {
  const dirs = [
    "Script/commands", "Script/events", "Script/events/cache/joinGif",
    "Script/events/leaveGif", "includes/database/models", "includes/handle",
    "includes/controllers", "languages", "logs", "backup", "utils", "assets",
  ];
  for (const d of dirs) fs.ensureDirSync(path.join(process.cwd(), d));

  process.on("unhandledRejection", (r) => { log.error(`অপ্রত্যাশিত প্রত্যাখ্যান: ${r}`); saveCrashLog("rejection", r); });
  process.on("uncaughtException", (e) => { log.error(`ব্যতিক্রমী ত্রুটি: ${e.message}`); saveCrashLog("exception", e); });

  loadConfig();
  loadLanguage(global.config.LANGUAGE || "bn");
  loadCommands();
  loadEvents();

  let models;
  try { 
    models = await connectDatabase(); 
  } catch (e) { 
    log.error(`ডেটাবেস ইনিশিয়ালাইজেশন ব্যর্থ হয়েছে।`);
    process.exit(1);
  }

  try {
    const keepAlivePath = path.join(process.cwd(), "keepAlive.js");
    if (fs.existsSync(keepAlivePath)) {
      require(keepAlivePath)();
    }
  } catch (e) {
    log.warn(`Keep-Alive সার্ভার চালু করা যায়নি: ${e.message}`);
  }

  startBot(models);
}

main();
        
