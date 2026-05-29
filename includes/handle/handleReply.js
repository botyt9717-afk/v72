"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return async function ({ event }) {
    if (event.type !== "message_reply") return;
    const { handleReply } = global.client;
    const { messageReply } = event;
    if (!messageReply) return;

    for (const handler of handleReply) {
      if (handler.messageID !== messageReply.messageID) continue;
      try {
        const cmd = global.client.commands.get(handler.commandName);
        if (cmd?.handleReply)
          await cmd.handleReply({ api, event, models, Users, Threads, Currencies, ...handler });
      } catch (err) {
        global.log.error(`Reply handler ত্রুটি: ${err.message}`);
      }
    }
  };
};
