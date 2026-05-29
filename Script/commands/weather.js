/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🌤️ weather.js — আবহাওয়া তথ্য
  BELAL BOTX666 | Master: Belal YT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
"use strict";
const axios = require("axios");
module.exports.config = {
  name: "weather",
  aliases: ["আবহাওয়া", "wtr"],
  version: "2.0.0",
  author: "Belal YT",
  description: "যেকোনো শহরের আবহাওয়া দেখায়",
  usage: "/weather [শহরের নাম]",
  category: "🌍 তথ্য",
  cooldowns: 5,
  hasPermssion: 0,
};

module.exports.run = async function ({ api, event, args, input, config }) {
  const { threadID, messageID } = event;
  const city = input || args.join(" ") || "Dhaka";
  const key = config.APIKEYS?.OPEN_WEATHER || process.env.OPEN_WEATHER_KEY;
  if (!key || key === "YOUR_OPENWEATHER_KEY_HERE")
    return api.sendMessage("❌ Weather API key সেট করা হয়নি।", threadID, messageID);

  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=bn`
    );
    const d = res.data;
    const weather = d.weather[0];
    const icons = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Drizzle: "🌦️" };
    const icon = icons[weather.main] || "🌤️";

    api.sendMessage(
      `${icon} আবহাওয়া তথ্য — ${d.name}, ${d.sys.country}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🌡️ তাপমাত্রা: ${d.main.temp}°C (অনুভব: ${d.main.feels_like}°C)\n` +
      `💧 আর্দ্রতা: ${d.main.humidity}%\n` +
      `🌬️ বাতাস: ${d.wind.speed} m/s\n` +
      `👁️ দৃশ্যমানতা: ${(d.visibility / 1000).toFixed(1)} km\n` +
      `📝 অবস্থা: ${weather.description}\n` +
      `⬆️ সর্বোচ্চ: ${d.main.temp_max}°C | ⬇️ সর্বনিম্ন: ${d.main.temp_min}°C`,
      threadID, messageID
    );
  } catch {
    api.sendMessage(`❌ "${city}" শহরের আবহাওয়া পাওয়া যায়নি।`, threadID, messageID);
  }
};
