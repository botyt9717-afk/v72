/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🧠 quiz.js — কুইজ গেম
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const activeQuiz = new Map();
const QUESTIONS = [
  { q: "বাংলাদেশের রাজধানী কোনটি?", a: "ঢাকা", opts: ["চট্টগ্রাম","ঢাকা","রাজশাহী","সিলেট"] },
  { q: "বাংলাদেশের জাতীয় ফুল কোনটি?", a: "শাপলা", opts: ["গোলাপ","শাপলা","চামেলি","সূর্যমুখী"] },
  { q: "বাংলাদেশের জাতীয় পাখি কোনটি?", a: "দোয়েল", opts: ["ময়না","দোয়েল","শালিক","কোকিল"] },
  { q: "বাংলাদেশ স্বাধীন হয় কত সালে?", a: "১৯৭১", opts: ["১৯৭০","১৯৭১","১৯৭২","১৯৬৯"] },
  { q: "পৃথিবীর সবচেয়ে বড় মহাসাগর কোনটি?", a: "প্রশান্ত মহাসাগর", opts: ["আটলান্টিক","ভারত মহাসাগর","প্রশান্ত মহাসাগর","আর্কটিক"] },
  { q: "আলোর গতি প্রতি সেকেন্ডে কত কিমি?", a: "৩ লক্ষ কিমি", opts: ["১ লক্ষ","২ লক্ষ","৩ লক্ষ কিমি","৫ লক্ষ"] },
  { q: "DNA-এর পূর্ণ রূপ কী?", a: "Deoxyribonucleic Acid", opts: ["Deoxyribonucleic Acid","Digital Network Architecture","Data Nucleic Analysis","Dynamic Nucleic Acid"] },
];
module.exports.config = {
  name: "quiz",
  aliases: ["কুইজ"],
  version: "2.0.0",
  author: "Belal YT",
  description: "মজার কুইজ খেলো এবং পুরস্কার জেতো",
  usage: "/quiz",
  category: "🎮 গেম",
  cooldowns: 10,
  hasPermssion: 0,
};
module.exports.run = async function ({ api, event, Currencies }) {
  const { threadID, messageID, senderID } = event;
  if (activeQuiz.has(threadID)) return api.sendMessage("⏳ আগের কুইজ চলছে! আগে শেষ করুন।", threadID, messageID);

  const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  const shuffled = q.opts.sort(() => Math.random() - 0.5);
  const labels = ["১","২","৩","৪"];
  activeQuiz.set(threadID, { answer: q.a, senderID, startTime: Date.now() });

  const msg = await new Promise(r => api.sendMessage(
    `🧠 কুইজ প্রশ্ন!\n━━━━━━━━━━━━━━\n❓ ${q.q}\n\n` +
    shuffled.map((o, i) => `${labels[i]}. ${o}`).join("\n") +
    `\n\n⏱️ ৩০ সেকেন্ডের মধ্যে উত্তর দিন!\n💰 সঠিক উত্তরে: ৫০০ টাকা`,
    threadID, (e, i) => r(i)
  ));

  setTimeout(() => {
    if (activeQuiz.has(threadID)) {
      activeQuiz.delete(threadID);
      api.sendMessage(`⏰ সময় শেষ! সঠিক উত্তর: ${q.a}`, threadID);
    }
  }, 30000);
};

module.exports.handleEvent = async function ({ api, event, Currencies }) {
  const { threadID, body, senderID, messageID } = event;
  if (!activeQuiz.has(threadID) || event.type !== "message") return;
  const quiz = activeQuiz.get(threadID);
  if (!body) return;
  if (body.trim().toLowerCase() === quiz.answer.toLowerCase() ||
      ["১","১.","1","1."].some(p => body.startsWith(p) && quiz.answer === QUESTIONS.find(x => x.q)?.opts?.[0])) {
    activeQuiz.delete(threadID);
    try { await Currencies.addBalance(senderID, 500); } catch {}
    const info = await api.getUserInfo(senderID);
    const name = info?.[senderID]?.name || senderID;
    api.sendMessage(`🎉 সঠিক উত্তর!\n👤 ${name} জিতেছেন!\n💰 +৫০০ টাকা পুরস্কার!`, threadID, messageID);
  }
};
