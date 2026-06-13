const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const responses8ball = [
  'It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes, definitely.',
  'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.',
  'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.',
  'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
  "Don't count on it.", 'My reply is no.', 'My sources say no.',
  'Outlook not so good.', 'Very doubtful.',
];

const jokes = [
  { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.' },
  { setup: 'Why did the developer go broke?', punchline: 'Because they used up all their cache.' },
  { setup: 'How many programmers does it take to change a light bulb?', punchline: 'None, that\'s a hardware problem.' },
  { setup: 'Why do Java developers wear glasses?', punchline: 'Because they don\'t C#.' },
  { setup: 'What\'s a computer\'s favorite snack?', punchline: 'Microchips.' },
  { setup: 'Why was the math book sad?', punchline: 'Because it had too many problems.' },
  { setup: 'What do you call a fish without eyes?', punchline: 'A fsh.' },
  { setup: 'Why can\'t a bicycle stand on its own?', punchline: 'Because it\'s two-tired.' },
];

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Ask the magic 8-ball a question')
      .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
    async execute(interaction) {
      const question = interaction.options.getString('question');
      const answer = responses8ball[Math.floor(Math.random() * responses8ball.length)];
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle('Magic 8-Ball')
            .addFields(
              { name: 'Question', value: question },
              { name: 'Answer', value: answer }
            )
        ]
      });
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName('coinflip')
      .setDescription('Flip a coin'),
    async execute(interaction) {
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xfee75c)
            .setDescription(`The coin landed on **${result}**!`)
        ]
      });
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName('dice')
      .setDescription('Roll a dice')
      .addIntegerOption(o => o.setName('sides').setDescription('Number of sides (default: 6)').setMinValue(2).setMaxValue(1000)),
    async execute(interaction) {
      const sides = interaction.options.getInteger('sides') ?? 6;
      const result = Math.floor(Math.random() * sides) + 1;
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57f287)
            .setDescription(`Rolled a **d${sides}** — Result: **${result}**`)
        ]
      });
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName('rps')
      .setDescription('Play Rock Paper Scissors')
      .addStringOption(o => o.setName('choice')
        .setDescription('Your choice')
        .setRequired(true)
        .addChoices(
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' }
        )),
    async execute(interaction) {
      const choices = ['rock', 'paper', 'scissors'];
      const userChoice = interaction.options.getString('choice');
      const botChoice = choices[Math.floor(Math.random() * 3)];

      let result;
      if (userChoice === botChoice) result = 'Draw!';
      else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
      ) result = 'You win!';
      else result = 'You lose!';

      const colors = { 'You win!': 0x57f287, 'You lose!': 0xed4245, 'Draw!': 0xfee75c };

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(colors[result])
            .setTitle(`Rock Paper Scissors — ${result}`)
            .addFields(
              { name: 'Your choice', value: userChoice.charAt(0).toUpperCase() + userChoice.slice(1), inline: true },
              { name: 'My choice', value: botChoice.charAt(0).toUpperCase() + botChoice.slice(1), inline: true }
            )
        ]
      });
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName('joke')
      .setDescription('Get a random joke'),
    async execute(interaction) {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xeb459e)
            .setTitle(joke.setup)
            .setDescription(`||${joke.punchline}||`)
            .setFooter({ text: 'Click the text to reveal the punchline!' })
        ]
      });
    },
  },
];
