const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getAutomodConfig, addWarning, getWarnings } = require('../utils/database');

const spamTracker = new Map(); // userId -> { count, lastMessage, timestamps }

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const member = message.member;
    if (!member) return;

    // Skip moderators
    if (member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    const config = getAutomodConfig(message.guild.id);

    // --- Anti Invite Link ---
    if (config.antiInvite) {
      const inviteRegex = /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9]+/gi;
      if (inviteRegex.test(message.content)) {
        await message.delete().catch(() => {});
        const warn = addWarning(message.guild.id, message.author.id, 'AutoMod: Posted invite link');
        await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff6b6b)
              .setDescription(`${message.author}, posting invite links is not allowed. (Warning ${warn.count}/3)`),
          ],
        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        await checkAutoAction(message.guild, member, warn.count);
        return;
      }
    }

    // --- Banned Words ---
    if (config.bannedWords && config.bannedWords.length > 0) {
      const lower = message.content.toLowerCase();
      const found = config.bannedWords.find(w => lower.includes(w.toLowerCase()));
      if (found) {
        await message.delete().catch(() => {});
        const warn = addWarning(message.guild.id, message.author.id, `AutoMod: Banned word`);
        await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff6b6b)
              .setDescription(`${message.author}, your message was removed for containing a prohibited word. (Warning ${warn.count}/3)`),
          ],
        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        await checkAutoAction(message.guild, member, warn.count);
        return;
      }
    }

    // --- Anti Spam (5 messages in 5 seconds) ---
    if (config.antiSpam) {
      const now = Date.now();
      const tracker = spamTracker.get(message.author.id) || { timestamps: [] };
      tracker.timestamps = tracker.timestamps.filter(t => now - t < 5000);
      tracker.timestamps.push(now);
      spamTracker.set(message.author.id, tracker);

      if (tracker.timestamps.length >= 5) {
        // Delete recent messages
        const msgs = await message.channel.messages.fetch({ limit: 10 }).catch(() => null);
        if (msgs) {
          const toDelete = msgs.filter(m => m.author.id === message.author.id);
          await message.channel.bulkDelete(toDelete).catch(() => {});
        }
        spamTracker.delete(message.author.id);

        const warn = addWarning(message.guild.id, message.author.id, 'AutoMod: Spam detected');
        await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff6b6b)
              .setDescription(`${message.author}, please stop spamming. (Warning ${warn.count}/3)`),
          ],
        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        await checkAutoAction(message.guild, member, warn.count);
        return;
      }
    }

    // --- Anti Mass Mention (5+ mentions) ---
    if (config.antiMassMention) {
      const mentionCount = message.mentions.users.size + message.mentions.roles.size;
      if (mentionCount >= 5) {
        await message.delete().catch(() => {});
        const warn = addWarning(message.guild.id, message.author.id, 'AutoMod: Mass mention');
        await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff6b6b)
              .setDescription(`${message.author}, mass mentioning is not allowed. (Warning ${warn.count}/3)`),
          ],
        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        await checkAutoAction(message.guild, member, warn.count);
        return;
      }
    }
  },
};

async function checkAutoAction(guild, member, warnCount) {
  try {
    if (warnCount >= 5) {
      await member.ban({ reason: 'AutoMod: Reached 5 warnings' }).catch(() => {});
    } else if (warnCount >= 3) {
      // Timeout for 10 minutes
      await member.timeout(10 * 60 * 1000, 'AutoMod: Reached 3 warnings').catch(() => {});
    }
  } catch (e) {}
}
