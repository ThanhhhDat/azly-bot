const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for ban'))
    .addIntegerOption(o => o.setName('days').setDescription('Delete messages from last X days (0-7)').setMinValue(0).setMaxValue(7)),

  cooldown: 5,

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const days = interaction.options.getInteger('days') ?? 0;

    if (!target) return interaction.reply({ embeds: [errorEmbed('User not found in this server.')], ephemeral: true });
    if (!target.bannable) return interaction.reply({ embeds: [errorEmbed('I cannot ban this user. They may have a higher role than me.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('You cannot ban yourself.')], ephemeral: true });

    try {
      await target.send({
        embeds: [new EmbedBuilder().setColor(0xed4245).setTitle(`You have been banned from ${interaction.guild.name}`).addFields(
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: interaction.user.tag }
        )]
      }).catch(() => {});

      await target.ban({ deleteMessageSeconds: days * 86400, reason: `${interaction.user.tag}: ${reason}` });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle('Member Banned')
            .addFields(
              { name: 'User', value: `${target.user.tag}`, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Reason', value: reason }
            )
        ]
      });
    } catch (e) {
      await interaction.reply({ embeds: [errorEmbed('Failed to ban the user.')], ephemeral: true });
    }
  },
};
