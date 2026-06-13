const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock or unlock a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(s => s.setName('channel').setDescription('Lock this channel')
      .addStringOption(o => o.setName('reason').setDescription('Reason')))
    .addSubcommand(s => s.setName('unlock').setDescription('Unlock this channel')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const everyoneRole = interaction.guild.roles.everyone;

    if (sub === 'channel') {
      await interaction.channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: false,
      });
      await interaction.reply({ embeds: [successEmbed(`Channel locked. Reason: ${reason}`)] });
    } else {
      await interaction.channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: null,
      });
      await interaction.reply({ embeds: [successEmbed('Channel unlocked.')] });
    }
  },
};
