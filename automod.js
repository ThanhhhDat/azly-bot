const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getAutomodConfig, setAutomodConfig, setLogChannel } = require('../../utils/database');
const { successEmbed, errorEmbed, infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure AutoMod settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s.setName('status').setDescription('View current AutoMod settings'))
    .addSubcommand(s => s.setName('toggle')
      .setDescription('Toggle an AutoMod feature')
      .addStringOption(o => o.setName('feature')
        .setDescription('Feature to toggle')
        .setRequired(true)
        .addChoices(
          { name: 'Anti Spam', value: 'antiSpam' },
          { name: 'Anti Invite', value: 'antiInvite' },
          { name: 'Anti Mass Mention', value: 'antiMassMention' }
        ))
      .addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable').setRequired(true)))
    .addSubcommand(s => s.setName('addword')
      .setDescription('Add a banned word')
      .addStringOption(o => o.setName('word').setDescription('Word to ban').setRequired(true)))
    .addSubcommand(s => s.setName('removeword')
      .setDescription('Remove a banned word')
      .addStringOption(o => o.setName('word').setDescription('Word to remove').setRequired(true)))
    .addSubcommand(s => s.setName('setlog')
      .setDescription('Set the moderation log channel')
      .addChannelOption(o => o.setName('channel').setDescription('Log channel').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'status') {
      const cfg = getAutomodConfig(guildId);
      const status = (v) => v ? '`Enabled`' : '`Disabled`';
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle('AutoMod Configuration')
            .addFields(
              { name: 'Anti Spam', value: status(cfg.antiSpam), inline: true },
              { name: 'Anti Invite', value: status(cfg.antiInvite), inline: true },
              { name: 'Anti Mass Mention', value: status(cfg.antiMassMention), inline: true },
              { name: 'Banned Words', value: cfg.bannedWords.length > 0 ? cfg.bannedWords.map(w => `\`${w}\``).join(', ') : 'None' }
            )
        ],
        ephemeral: true
      });

    } else if (sub === 'toggle') {
      const feature = interaction.options.getString('feature');
      const enabled = interaction.options.getBoolean('enabled');
      setAutomodConfig(guildId, feature, enabled);
      await interaction.reply({ embeds: [successEmbed(`**${feature}** has been ${enabled ? 'enabled' : 'disabled'}.`)], ephemeral: true });

    } else if (sub === 'addword') {
      const word = interaction.options.getString('word').toLowerCase();
      const cfg = getAutomodConfig(guildId);
      if (cfg.bannedWords.includes(word)) return interaction.reply({ embeds: [errorEmbed('That word is already banned.')], ephemeral: true });
      cfg.bannedWords.push(word);
      await interaction.reply({ embeds: [successEmbed(`Added \`${word}\` to banned words.`)], ephemeral: true });

    } else if (sub === 'removeword') {
      const word = interaction.options.getString('word').toLowerCase();
      const cfg = getAutomodConfig(guildId);
      const idx = cfg.bannedWords.indexOf(word);
      if (idx === -1) return interaction.reply({ embeds: [errorEmbed('That word is not in the list.')], ephemeral: true });
      cfg.bannedWords.splice(idx, 1);
      await interaction.reply({ embeds: [successEmbed(`Removed \`${word}\` from banned words.`)], ephemeral: true });

    } else if (sub === 'setlog') {
      const channel = interaction.options.getChannel('channel');
      setLogChannel(guildId, channel.id);
      await interaction.reply({ embeds: [successEmbed(`Log channel set to ${channel}.`)], ephemeral: true });
    }
  },
};
