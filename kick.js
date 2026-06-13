const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for kick')),

  cooldown: 5,

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ embeds: [errorEmbed('User not found.')], ephemeral: true });
    if (!target.kickable) return interaction.reply({ embeds: [errorEmbed('I cannot kick this user.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('You cannot kick yourself.')], ephemeral: true });

    try {
      await target.send({
        embeds: [new EmbedBuilder().setColor(0xfee75c).setTitle(`You have been kicked from ${interaction.guild.name}`).addFields(
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: interaction.user.tag }
        )]
      }).catch(() => {});

      await target.kick(`${interaction.user.tag}: ${reason}`);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xfee75c)
            .setTitle('Member Kicked')
            .addFields(
              { name: 'User', value: target.user.tag, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Reason', value: reason }
            )
        ]
      });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Failed to kick the user.')], ephemeral: true });
    }
  },
};
