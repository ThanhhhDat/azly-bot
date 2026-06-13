const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { getLogChannel } = require('../utils/database');

async function sendLog(guild, embed) {
  const channelId = getLogChannel(guild.id);
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId);
  if (channel) await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = [
  {
    name: 'guildMemberAdd',
    async execute(member, client) {
      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle('Member Joined')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Members', value: `${member.guild.memberCount}`, inline: true }
        )
        .setTimestamp();
      await sendLog(member.guild, embed);
    },
  },
  {
    name: 'guildMemberRemove',
    async execute(member, client) {
      const embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle('Member Left')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Joined', value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
          { name: 'Members', value: `${member.guild.memberCount}`, inline: true }
        )
        .setTimestamp();
      await sendLog(member.guild, embed);
    },
  },
  {
    name: 'messageDelete',
    async execute(message, client) {
      if (message.author?.bot) return;
      if (!message.guild) return;
      const embed = new EmbedBuilder()
        .setColor(0xfee75c)
        .setTitle('Message Deleted')
        .addFields(
          { name: 'Author', value: message.author ? `${message.author.tag} (${message.author.id})` : 'Unknown', inline: true },
          { name: 'Channel', value: `${message.channel}`, inline: true },
          { name: 'Content', value: message.content?.slice(0, 1024) || '*[No content / attachment]*' }
        )
        .setTimestamp();
      await sendLog(message.guild, embed);
    },
  },
  {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
      if (newMessage.author?.bot) return;
      if (!newMessage.guild) return;
      if (oldMessage.content === newMessage.content) return;
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('Message Edited')
        .addFields(
          { name: 'Author', value: `${newMessage.author.tag} (${newMessage.author.id})`, inline: true },
          { name: 'Channel', value: `${newMessage.channel}`, inline: true },
          { name: 'Before', value: oldMessage.content?.slice(0, 512) || '*empty*' },
          { name: 'After', value: newMessage.content?.slice(0, 512) || '*empty*' }
        )
        .setUrl(newMessage.url)
        .setTimestamp();
      await sendLog(newMessage.guild, embed);
    },
  },
];
