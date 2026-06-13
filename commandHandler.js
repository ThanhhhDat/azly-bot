const { readdirSync } = require('fs');
const { join } = require('path');

function loadCommands(client) {
  const foldersPath = join(__dirname, '../commands');
  const commandFolders = readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      const exported = require(join(commandsPath, file));
      // Support both single command export and array of commands
      const commands = Array.isArray(exported) ? exported : [exported];
      for (const command of commands) {
        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
        }
      }
    }
  }

  console.log(`[Commands] Loaded ${client.commands.size} commands.`);
}

module.exports = { loadCommands };
