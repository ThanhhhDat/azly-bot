const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout (mute) a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 10m, 1h, 1d').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),

  cooldown: 5,

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ embeds: [errorEmbed('User not found.')], ephemeral: true });
    if (!target.moderatable) return interaction.reply({ embeds: [errorEmbed('I cannot mute this user.')], ephemeral: true });

    const duration = ms(durationStr);
    if (!duration || duration > 2419200000) {
      return interaction.reply({ embeds: [errorEmbed('Invalid duration. Use formats like `10m`, `1h`, `7d`. Max 28 days.')], ephemeral: true });
    }

    try {
      await target.timeout(duration, `${interaction.user.tag}: ${reason}`);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xfee75c)
            .setTitle('Member Muted')
            .addFields(
              { name: 'User', value: target.user.tag, inline: true },
              { name: 'Duration', value: durationStr, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Reason', value: reason }
            )
        ]
      });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Failed to mute the user.')], ephemeral: true });
    }
  },
};
