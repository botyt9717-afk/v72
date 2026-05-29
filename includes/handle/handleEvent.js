"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return async function ({ event }) {
    const { events, eventRegistered, commands } = global.client;
    const { threadID, senderID } = event;

    // ━━━ Event handlers চালানো ━━━
    for (const [name, evt] of events) {
      try {
        if (!global.config.EVENT_DISABLED?.includes(name))
          await evt.handleEvent({ api, event, models, Users, Threads, Currencies });
      } catch (err) {
        global.log.error(`ইভেন্ট [${name}] ত্রুটি: ${err.message}`);
      }
    }

    // ━━━ Command handleEvent চালানো ━━━
    for (const name of eventRegistered) {
      const cmd = commands.get(name);
      if (!cmd?.handleEvent) continue;
      try {
        await cmd.handleEvent({ api, event, models, Users, Threads, Currencies });
      } catch (err) {
        global.log.error(`Command Event [${name}] ত্রুটি: ${err.message}`);
      }
    }
  };
};
