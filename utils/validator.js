/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   BELAL BOTX666 — Validator System
 *   Bot চালুর আগে সব কিছু চেক করে
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

"use strict";

const fs = require("fs-extra");
const path = require("path");

const REQUIRED_FILES = [
  "index.js",
  "config.json",
  "package.json",
  "appstate.json",
  "includes/database/index.js",
  "includes/listen.js",
  "utils/log.js",
];

const REQUIRED_FOLDERS = [
  "Script/commands",
  "Script/events",
  "includes/database/models",
  "includes/handle",
  "languages",
  "logs",
  "backup",
  "tmp",
];

async function check() {
  const root = process.cwd();
  let ok = true;

  console.log("\n🔍 ফাইল ও ফোল্ডার চেক হচ্ছে...\n");

  // ফোল্ডার চেক ও তৈরি
  for (const folder of REQUIRED_FOLDERS) {
    const full = path.join(root, folder);
    if (!fs.existsSync(full)) {
      fs.ensureDirSync(full);
      console.log(`  📁 তৈরি হলো: ${folder}`);
    }
  }

  // ফাইল চেক
  for (const file of REQUIRED_FILES) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      if (file === "appstate.json") {
        console.log(`  ⚠️  appstate.json নেই — Facebook cookie export করে যোগ করো!`);
      } else {
        console.log(`  ❌ নেই: ${file}`);
        ok = false;
      }
    } else {
      console.log(`  ✅ আছে: ${file}`);
    }
  }

  // config.json JSON syntax চেক
  try {
    const raw = fs.readFileSync(path.join(root, "config.json"), "utf-8");
    JSON.parse(raw);
    console.log("  ✅ config.json JSON syntax ঠিক আছে");
  } catch (e) {
    console.log("  ❌ config.json JSON syntax ভুল: " + e.message);
    ok = false;
  }

  // package.json চেক
  try {
    const raw = fs.readFileSync(path.join(root, "package.json"), "utf-8");
    JSON.parse(raw);
    console.log("  ✅ package.json JSON syntax ঠিক আছে");
  } catch (e) {
    console.log("  ❌ package.json JSON syntax ভুল: " + e.message);
    ok = false;
  }

  console.log(ok ? "\n✅ সব চেক পাস হয়েছে!\n" : "\n❌ কিছু সমস্যা আছে। উপরের error গুলো ঠিক করো।\n");
  return ok;
}

module.exports = { check };

// সরাসরি রান করলে
if (require.main === module) {
  check().then(ok => process.exit(ok ? 0 : 1));
}
