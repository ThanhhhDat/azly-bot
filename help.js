const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const categories = {
  moderation: {
    label: 'Moderation',
    description: 'Server moderation tools',
    color: 0xed4245,
    commands: [
      { name: '/ban', desc: 'Ban a member from the server' },
      { name: '/unban', desc: 'Unban a user by ID' },
      { name: '/kick', desc: 'Kick a member from the server' },
      { name: '/mute', desc: 'Timeout a member (e.g. 10m, 1h)' },
      { name: '/unmute', desc: 'Remove timeout from a member' },
      { name: '/warn add', desc: 'Issue a warning to a user' },
      { name: '/warn list', desc: 'View warnings for a user' },
      { name: '/warn clear', desc: 'Clear all warnings for a user' },
      { name: '/warn remove', desc: 'Remove a specific warning' },
      { name: '/purge', desc: 'Bulk delete messages (1-100)' },
      { name: '/slowmode', desc: 'Set channel slowmode' },
      { name: '/lock', desc: 'Lock a channel' },
      { name: '/unlock', desc: 'Unlock a channel' },
    ],
  },
  automod: {
    label: 'AutoMod',
    description: 'Automatic moderation settings',
    color: 0xfee75c,
    commands: [
      { name: '/automod status', desc: 'View current AutoMod settings' },
      { name: '/automod toggle', desc: 'Toggle anti-spam, anti-invite, anti-mention' },
      { name: '/automod addword', desc: 'Add a banned word' },
      { name: '/automod removeword', desc: 'Remove a banned word' },
      { name: '/automod setlog', desc: 'Set the moderation log channel' },
    ],
  },
  info: {
    label: 'Info',
    description: 'Server and user information',
    color: 0x5865f2,
    commands: [
      { name: '/userinfo', desc: 'View info about a user' },
      { name: '/serverinfo', desc: 'View info about the server' },
      { name: '/avatar', desc: "Show a user's avatar" },
      { name: '/roleinfo', desc: 'View info about a role' },
    ],
  },
  utility: {
    label: 'Utility',
    description: 'Useful utility commands',
    color: 0x57f287,
    commands: [
      { name: '/ping', desc: 'Check bot latency' },
      { name: '/slowmode', desc: 'Set slowmode for a channel' },
      { name: '/role add', desc: 'Add a role to a member' },
      { name: '/role remove', desc: 'Remove a role from a member' },
      { name: '/embed', desc: 'Create a custom embed message' },
    ],
  },
  fun: {
    label: 'Fun',
    description: 'Fun and entertainment commands',
    color: 0xeb459e,
    commands: [
      { name: '/8ball', desc: 'Ask the magic 8-ball a question' },
      { name: '/coinflip', desc: 'Flip a coin' },
      { name: '/dice', desc: 'Roll a dice (customize sides)' },
      { name: '/rps', desc: 'Play rock paper scissors' },
      { name: '/joke', desc: 'Get a random joke' },
    ],
  },
  ai: {
    label: 'AI Assistant',
    description: 'Built-in AI assistant',
    color: 0x9b59b6,
    commands: [
      { name: '/ask', desc: 'Ask the AI assistant a question' },
      { name: '/translate', desc: 'Translate text using AI' },
    ],
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),

  async execute(interaction) {
    const mainEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Bot Commands')
      .setDescription('Select a category below to view its commands.')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        Object.values(categories).map(cat => ({
          name: cat.label,
          value: cat.description,
          inline: true,
        }))
      )
      .setFooter({ text: `${interaction.guild.name}` })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('Select a category...')
      .addOptions(
        Object.entries(categories).map(([key, cat]) => ({
          label: cat.label,
          description: cat.description,
          value: key,
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    const reply = await interaction.reply({ embeds: [mainEmbed], components: [row], fetchReply: true });

    // Collector for select menu (60s)
    const collector = reply.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'This menu is not for you.', ephemeral: true });
      }

      const cat = categories[i.values[0]];
      const catEmbed = new EmbedBuilder()
        .setColor(cat.color)
        .setTitle(`${cat.label} Commands`)
        .setDescription(cat.commands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n'))
        .setFooter({ text: 'Use /help to go back to overview' });

      await i.update({ embeds: [catEmbed], components: [row] });
    });

    collector.on('end', () => {
      reply.edit({ components: [] }).catch(() => {});
    });
  },
};
