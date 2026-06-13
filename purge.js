const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Only delete messages from this user')),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    try {
      let messages = await interaction.channel.messages.fetch({ limit: 100 });
      // Filter to messages newer than 14 days (Discord limitation)
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      messages = messages.filter(m => m.createdTimestamp > twoWeeksAgo);

      if (targetUser) {
        messages = messages.filter(m => m.author.id === targetUser.id);
      }

      messages = [...messages.values()].slice(0, amount);

      const deleted = await interaction.channel.bulkDelete(messages, true);
      await interaction.editReply({ embeds: [successEmbed(`Deleted ${deleted.size} message(s).`)] });
    } catch (e) {
      await interaction.editReply({ embeds: [errorEmbed('Failed to delete messages.')] });
    }
  },
};
