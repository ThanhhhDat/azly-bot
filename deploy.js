require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const commands = [];
const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const exported = require(join(commandsPath, file));
    const cmds = Array.isArray(exported) ? exported : [exported];
    for (const cmd of cmds) {
      if (cmd.data) commands.push(cmd.data.toJSON());
    }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Deploying ${commands.length} slash commands...`);

    // Use GUILD_ID for instant deploy (guild-specific), or remove for global (up to 1hr)
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`Successfully deployed to guild ${process.env.GUILD_ID}`);
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('Successfully deployed globally.');
    }
  } catch (error) {
    console.error(error);
  }
})();
