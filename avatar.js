const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Show a user's avatar")
    .addUserOption(o => o.setName('user').setDescription('User')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 512, extension: 'png' }))
      .setURL(user.displayAvatarURL({ size: 512 }));
    await interaction.reply({ embeds: [embed] });
  },
};
