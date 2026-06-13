const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(o => o.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600)),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);
    if (seconds === 0) {
      await interaction.reply({ embeds: [successEmbed(`Slowmode disabled in ${interaction.channel}.`)] });
    } else {
      await interaction.reply({ embeds: [successEmbed(`Slowmode set to **${seconds}s** in ${interaction.channel}.`)] });
    }
  },
};
