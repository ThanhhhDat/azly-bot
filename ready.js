const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[Bot] Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: '/help | Protecting the server', type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
