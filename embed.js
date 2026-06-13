const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send a custom embed message')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(o => o.setName('title').setDescription('Embed title').setRequired(true))
    .addStringOption(o => o.setName('description').setDescription('Embed description').setRequired(true))
    .addStringOption(o => o.setName('color').setDescription('Hex color e.g. #5865f2').setRequired(false))
    .addStringOption(o => o.setName('footer').setDescription('Footer text'))
    .addStringOption(o => o.setName('image').setDescription('Image URL'))
    .addChannelOption(o => o.setName('channel').setDescription('Channel to send to (default: current)')),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const colorHex = interaction.options.getString('color') ?? '#5865F2';
    const footer = interaction.options.getString('footer');
    const image = interaction.options.getString('image');
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    let color;
    try {
      color = parseInt(colorHex.replace('#', ''), 16);
      if (isNaN(color)) throw new Error();
    } catch {
      return interaction.reply({ embeds: [errorEmbed('Invalid hex color. Use format `#RRGGBB`.')], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();

    if (footer) embed.setFooter({ text: footer });
    if (image) embed.setImage(image);

    try {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: `Embed sent to ${channel}.`, ephemeral: true });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Failed to send embed. Check my permissions in that channel.')], ephemeral: true });
    }
  },
};
