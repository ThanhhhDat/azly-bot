const { EmbedBuilder, Collection } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Cooldown check
    if (!client.cooldowns.has(command.data.name)) {
      client.cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expireTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expireTime) {
        const remaining = ((expireTime - now) / 1000).toFixed(1);
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff6b6b)
              .setDescription(`Please wait **${remaining}s** before using \`/${command.data.name}\` again.`),
          ],
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[Error] Command ${interaction.commandName}:`, error);
      const msg = { content: 'An error occurred while running this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  },
};
