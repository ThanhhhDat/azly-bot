const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { addWarning, getWarnings, clearWarnings, removeWarning } = require('../../utils/database');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warning management')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(s => s.setName('add').setDescription('Warn a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('View warnings for a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommand(s => s.setName('clear').setDescription('Clear all warnings for a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove a specific warning')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addIntegerOption(o => o.setName('index').setDescription('Warning number (from /warn list)').setRequired(true).setMinValue(1))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;

    if (sub === 'add') {
      const reason = interaction.options.getString('reason');
      const result = addWarning(guildId, user.id, reason);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xfee75c)
            .setTitle('Warning Issued')
            .addFields(
              { name: 'User', value: `${user.tag}`, inline: true },
              { name: 'Warnings', value: `${result.count}`, inline: true },
              { name: 'Moderator', value: interaction.user.tag, inline: true },
              { name: 'Reason', value: reason }
            )
        ]
      });

    } else if (sub === 'list') {
      const warns = getWarnings(guildId, user.id);
      if (warns.length === 0) return interaction.reply({ embeds: [successEmbed(`${user.tag} has no warnings.`)], ephemeral: true });

      const list = warns.map((w, i) => `**${i + 1}.** ${w.reason} — <t:${Math.floor(new Date(w.date).getTime() / 1000)}:R>`).join('\n');
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xfee75c)
            .setTitle(`Warnings for ${user.tag}`)
            .setDescription(list)
            .setFooter({ text: `Total: ${warns.length}` })
        ]
      });

    } else if (sub === 'clear') {
      clearWarnings(guildId, user.id);
      await interaction.reply({ embeds: [successEmbed(`Cleared all warnings for ${user.tag}.`)] });

    } else if (sub === 'remove') {
      const index = interaction.options.getInteger('index') - 1;
      const ok = removeWarning(guildId, user.id, index);
      if (!ok) return interaction.reply({ embeds: [errorEmbed('Invalid warning number.')], ephemeral: true });
      await interaction.reply({ embeds: [successEmbed(`Warning #${index + 1} removed from ${user.tag}.`)] });
    }
  },
};
