const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('userid').setDescription('User ID to unban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    try {
      await interaction.guild.members.unban(userId, `${interaction.user.tag}: ${reason}`);
      await interaction.reply({ embeds: [successEmbed(`User \`${userId}\` has been unbanned.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not unban that user. Make sure the ID is correct and the user is banned.')], ephemeral: true });
    }
  },
};
