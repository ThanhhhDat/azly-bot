const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Built-in AI knowledge base - rule-based + pattern matching
const knowledgeBase = [
  // Greetings
  { patterns: ['hello', 'hi', 'hey', 'xin chào', 'chào'], response: (u) => `Hello, ${u}! How can I help you today?` },
  { patterns: ['good morning', 'good night', 'good evening'], response: () => 'Greetings! Hope you have a wonderful day.' },
  { patterns: ['how are you', 'how r u', 'bạn khỏe không'], response: () => "I'm doing great, thanks for asking! I'm always ready to help." },

  // Bot info
  { patterns: ['who are you', 'what are you', 'introduce yourself', 'bạn là ai'], response: () => "I'm a custom Discord bot built with discord.js! I can moderate servers, answer questions, and much more. Use `/help` to see all commands." },
  { patterns: ['what can you do', 'your features', 'commands'], response: () => "I can moderate servers (ban, kick, mute, warn), auto-mod spam and bad words, manage roles, and answer questions! Use `/help` for the full list." },

  // Discord help
  { patterns: ['how to create server', 'make discord server'], response: () => "To create a Discord server: Open Discord → Click the **+** button on the left sidebar → Select **Create My Own** → Fill in the details and you're done!" },
  { patterns: ['how to add bot', 'invite bot'], response: () => "To add a bot to your server, you need its invite link. Go to the Discord Developer Portal → OAuth2 → URL Generator, select `bot` scope and the permissions you need, then use that link." },
  { patterns: ['what is discord', 'discord kia là gì'], response: () => "Discord is a communication platform designed for communities. It supports text, voice, and video communication, and is widely used by gamers, developers, and online communities." },

  // General knowledge
  { patterns: ['what is ai', 'ai là gì', 'artificial intelligence'], response: () => "AI (Artificial Intelligence) is the simulation of human intelligence in machines. It includes machine learning, natural language processing, computer vision, and more." },
  { patterns: ['what is programming', 'what is coding', 'lập trình là gì'], response: () => "Programming is the process of writing instructions for computers to follow. Popular languages include Python, JavaScript, Java, C++, and many others." },
  { patterns: ['what is javascript', 'what is js'], response: () => "JavaScript is a high-level programming language used for web development. It runs in the browser and on servers (via Node.js). This bot is built with JavaScript!" },
  { patterns: ['what is python'], response: () => "Python is a versatile, beginner-friendly programming language used in web development, data science, AI, automation, and more." },

  // Math
  { patterns: [/^(\d+)\s*\+\s*(\d+)$/], response: (u, m) => `${parseInt(m[1]) + parseInt(m[2])}` },
  { patterns: [/^(\d+)\s*\-\s*(\d+)$/], response: (u, m) => `${parseInt(m[1]) - parseInt(m[2])}` },
  { patterns: [/^(\d+)\s*\*\s*(\d+)$/], response: (u, m) => `${parseInt(m[1]) * parseInt(m[2])}` },
  { patterns: [/^(\d+)\s*\/\s*(\d+)$/], response: (u, m) => parseInt(m[2]) !== 0 ? `${(parseInt(m[1]) / parseInt(m[2])).toFixed(4)}` : "You can't divide by zero!" },

  // Fun
  { patterns: ['tell me a joke', 'joke', 'funny'], response: () => "Why do programmers prefer dark mode? Because light attracts bugs! 🐛" },
  { patterns: ['what is the meaning of life', 'ý nghĩa cuộc sống'], response: () => "The meaning of life is subjective, but many philosophers say it's about connection, growth, and finding purpose. What does it mean to you?" },
  { patterns: ['roll a dice', 'roll dice', 'random number'], response: () => `Your random number is: **${Math.floor(Math.random() * 6) + 1}** (1d6)` },
  { patterns: ['flip a coin', 'coin flip'], response: () => `The coin landed on: **${Math.random() < 0.5 ? 'Heads' : 'Tails'}**!` },

  // Time
  { patterns: ['what time is it', 'current time', 'mấy giờ rồi'], response: () => `Current UTC time: **${new Date().toUTCString()}**` },
  { patterns: ['what day is it', 'today date', 'hôm nay là ngày'], response: () => `Today is: **${new Date().toDateString()}**` },
];

function getAIResponse(question, username) {
  const lower = question.toLowerCase().trim();

  for (const entry of knowledgeBase) {
    for (const pattern of entry.patterns) {
      if (typeof pattern === 'string') {
        if (lower.includes(pattern)) {
          return entry.response(username, null);
        }
      } else if (pattern instanceof RegExp) {
        const match = lower.match(pattern);
        if (match) {
          return entry.response(username, match);
        }
      }
    }
  }

  // Fallback responses
  const fallbacks = [
    `That's an interesting question! I'm a simple AI and don't have the answer to that yet. Try asking something else or use \`/help\` to see what I can do.`,
    `I'm not sure about that one. I'm a basic AI assistant — I can answer common questions, do math, and tell you about Discord. What else can I help with?`,
    `Hmm, I don't have information on that topic yet. Try asking me about Discord, programming, or general knowledge!`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('ask')
      .setDescription('Ask the AI assistant a question')
      .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),

    cooldown: 3,

    async execute(interaction) {
      const question = interaction.options.getString('question');
      const answer = getAIResponse(question, interaction.user.username);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('AI Assistant')
            .addFields(
              { name: 'Question', value: question },
              { name: 'Answer', value: answer }
            )
            .setFooter({ text: `Asked by ${interaction.user.tag}` })
            .setTimestamp()
        ]
      });
    },
  },

  {
    data: new SlashCommandBuilder()
      .setName('translate')
      .setDescription('Translate text between English and Vietnamese')
      .addStringOption(o => o.setName('text').setDescription('Text to translate').setRequired(true))
      .addStringOption(o => o.setName('to').setDescription('Target language').setRequired(true)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Vietnamese', value: 'vi' }
        )),

    async execute(interaction) {
      const text = interaction.options.getString('text');
      const to = interaction.options.getString('to');

      // Basic built-in dictionary
      const enToVi = {
        'hello': 'xin chào', 'goodbye': 'tạm biệt', 'thank you': 'cảm ơn',
        'yes': 'có', 'no': 'không', 'please': 'làm ơn', 'sorry': 'xin lỗi',
        'good morning': 'chào buổi sáng', 'good night': 'chúc ngủ ngon',
        'how are you': 'bạn khỏe không', 'i love you': 'tôi yêu bạn',
        'welcome': 'chào mừng', 'help': 'giúp đỡ', 'water': 'nước',
        'food': 'thức ăn', 'friend': 'bạn bè', 'family': 'gia đình',
      };
      const viToEn = Object.fromEntries(Object.entries(enToVi).map(([k, v]) => [v, k]));

      const dict = to === 'vi' ? enToVi : viToEn;
      const lower = text.toLowerCase();
      const translated = dict[lower];

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('Translation')
            .addFields(
              { name: 'Original', value: text },
              { name: `Translation (${to === 'vi' ? 'Vietnamese' : 'English'})`, value: translated || '*Translation not found in built-in dictionary. For full translation, use Google Translate.*' }
            )
        ]
      });
    },
  },
];
