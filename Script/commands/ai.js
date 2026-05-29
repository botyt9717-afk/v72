/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🤖 ai.js — AI চ্যাট কমান্ড
  BELAL BOTX666 | Master: Belal YT
  Multi-AI: Groq → Gemini → OpenAI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");

module.exports.config = {
  name: "ai",
  aliases: ["gpt", "ask", "জিজ্ঞেস", "বলো"],
  version: "3.0.0",
  author: "Belal YT",
  description: "AI দিয়ে যেকোনো প্রশ্নের উত্তর পাও",
  usage: "/ai [প্রশ্ন] অথবা কোনো মেসেজ reply করে /ai",
  category: "🤖 AI",
  cooldowns: 5,
  hasPermssion: 0,
};

const conversationHistory = new Map();

module.exports.run = async function ({ api, event, args, input, config }) {
  const { threadID, messageID, senderID, messageReply } = event;

  let question = input || (messageReply?.body) || args.join(" ");
  if (!question) {
    return api.sendMessage(
      `❓ কিছু জিজ্ঞেস করুন!\n\n📌 ব্যবহার:\n• /ai বাংলাদেশের রাজধানী কী?\n• /ai কবিতা লিখে দাও\n• /ai কোড ঠিক করো (reply করে)`,
      threadID, messageID
    );
  }

  const thinking = await sendTemp("⏳ ভাবছি...", api, threadID);

  try {
    const history = conversationHistory.get(senderID) || [];
    history.push({ role: "user", content: question });
    if (history.length > 10) history.shift();

    const reply = await callAI(question, history, config);
    history.push({ role: "assistant", content: reply });
    conversationHistory.set(senderID, history);

    api.unsendMessage(thinking);
    api.sendMessage(`🤖 ${reply}\n\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়🪬❈┉┄`, threadID, messageID);
  } catch (err) {
    api.unsendMessage(thinking);
    api.sendMessage(`❌ AI থেকে উত্তর পাওয়া যায়নি!\n⚠️ ত্রুটি: ${err.message}`, threadID, messageID);
  }
};

async function callAI(question, history, config) {
  const { APIKEYS, MODULES } = config;
  const primary = MODULES?.ai?.model || "groq";
  const fallback = MODULES?.ai?.fallback || "gemini";

  try {
    if (primary === "groq" && APIKEYS?.GROQ && APIKEYS.GROQ !== "YOUR_GROQ_API_KEY_HERE")
      return await callGroq(question, history, APIKEYS.GROQ);
  } catch {}

  try {
    if (APIKEYS?.GEMINI && APIKEYS.GEMINI !== "YOUR_GEMINI_API_KEY_HERE")
      return await callGemini(question, APIKEYS.GEMINI);
  } catch {}

  try {
    if (APIKEYS?.OPENAI && APIKEYS.OPENAI !== "YOUR_OPENAI_API_KEY_HERE")
      return await callOpenAI(question, history, APIKEYS.OPENAI);
  } catch {}

  return await callFreeAI(question);
}

async function callGroq(question, history, apiKey) {
  const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: "তুমি BELAL BOTX666, একটি বাংলা AI সহকারী। Master: Belal YT। সব প্রশ্নের উত্তর বাংলায় দাও।" },
      ...history,
    ],
    max_tokens: 1024,
    temperature: 0.7,
  }, { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } });
  return res.data.choices[0].message.content;
}

async function callGemini(question, apiKey) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { contents: [{ parts: [{ text: question }] }] }
  );
  return res.data.candidates[0].content.parts[0].text;
}

async function callOpenAI(question, history, apiKey) {
  const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "তুমি BELAL BOTX666 AI সহকারী। বাংলায় উত্তর দাও।" },
      ...history,
    ],
    max_tokens: 1024,
  }, { headers: { Authorization: `Bearer ${apiKey}` } });
  return res.data.choices[0].message.content;
}

async function callFreeAI(question) {
  const res = await axios.get(`https://api.freegpt4.ddns.net/?question=${encodeURIComponent(question)}`);
  return res.data?.answer || res.data?.response || "দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না।";
}

async function sendTemp(msg, api, threadID) {
  return new Promise(resolve => {
    api.sendMessage(msg, threadID, (err, info) => resolve(info?.messageID));
  });
}
