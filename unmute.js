const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    if (!target) return interaction.reply({ embeds: [errorEmbed('User not found.')], ephemeral: true });
    if (!target.isCommunicationDisabled()) return interaction.reply({ embeds: [errorEmbed('This user is not muted.')], ephemeral: true });

    await target.timeout(null);
    await interaction.reply({ embeds: [successEmbed(`${target.user.tag} has been unmuted.`)] });
  },
};
