const { readdirSync } = require('fs');
const { join } = require('path');

function loadEvents(client) {
  const eventsPath = join(__dirname, '../events');
  const eventFiles = readdirSync(eventsPath).filter(f => f.endsWith('.js'));

  for (const file of eventFiles) {
    const exported = require(join(eventsPath, file));
    // Support both single event export and array of events
    const events = Array.isArray(exported) ? exported : [exported];
    for (const event of events) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }

  console.log(`[Events] Loaded ${eventFiles.length} events.`);
}

module.exports = { loadEvents };
