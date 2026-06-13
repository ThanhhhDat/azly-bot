const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),

  async execute(interaction, client) {
    const sent = await interaction.reply({ content: 'Measuring...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = client.ws.ping;

    await interaction.editReply({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setColor(0x57f287)
          .setTitle('Pong!')
          .addFields(
            { name: 'Roundtrip', value: `${roundtrip}ms`, inline: true },
            { name: 'WebSocket', value: `${wsLatency}ms`, inline: true }
          )
      ]
    });
  },
};
