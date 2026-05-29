/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   BELAL BOTX666 — Logger System
 *   বাংলায় সব log দেখাবে
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

"use strict";

const chalk = require("chalk");
const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = require("path");

const logDir = path.join(process.cwd(), "logs");
fs.ensureDirSync(logDir);

function getTime() {
  return moment().tz("Asia/Dhaka").format("HH:mm:ss");
}

function getDate() {
  return moment().tz("Asia/Dhaka").format("DD/MM/YYYY");
}

function writeToFile(type, message) {
  try {
    const logFile = path.join(logDir, `${moment().tz("Asia/Dhaka").format("YYYY-MM-DD")}.log`);
    const line = `[${getDate()} ${getTime()}] [${type}] ${message}\n`;
    fs.appendFileSync(logFile, line);
  } catch {}
}

const logger = {
  info: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.cyan("[ INFO ]")} ${chalk.white(msg)}`;
    console.log(line);
    writeToFile("INFO", msg);
  },

  success: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.green("[ ✅ OK ]")} ${chalk.greenBright(msg)}`;
    console.log(line);
    writeToFile("SUCCESS", msg);
  },

  warn: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.yellow("[ ⚠️ WARNING ]")} ${chalk.yellow(msg)}`;
    console.log(line);
    writeToFile("WARN", msg);
  },

  error: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.red("[ ❌ ERROR ]")} ${chalk.redBright(msg)}`;
    console.log(line);
    writeToFile("ERROR", msg);
  },

  bot: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.magenta("[ 🤖 BOT ]")} ${chalk.magentaBright(msg)}`;
    console.log(line);
    writeToFile("BOT", msg);
  },

  cmd: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.blue("[ 🔧 CMD ]")} ${chalk.blueBright(msg)}`;
    console.log(line);
    writeToFile("CMD", msg);
  },

  db: (msg) => {
    const line = `${chalk.gray(`[${getTime()}]`)} ${chalk.yellowBright("[ 🗄️ DB ]")} ${chalk.yellow(msg)}`;
    console.log(line);
    writeToFile("DB", msg);
  },

  // function call style: logger("message", "type")
};

// function-style call support: logger("msg") বা logger("msg", "ERROR")
function log(msg, type = "INFO") {
  const t = type.toUpperCase();
  if (t === "ERROR") logger.error(msg);
  else if (t === "WARN" || t === "WARNING") logger.warn(msg);
  else if (t === "SUCCESS") logger.success(msg);
  else if (t === "BOT") logger.bot(msg);
  else if (t === "CMD") logger.cmd(msg);
  else if (t === "DB") logger.db(msg);
  else logger.info(msg);
}

// উভয় ব্যবহার সাপোর্ট: require করে logger.info() বা logger() দুটোই কাজ করবে
Object.assign(log, logger);

module.exports = log;
  
