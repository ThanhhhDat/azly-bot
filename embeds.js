const { EmbedBuilder } = require('discord.js');

function successEmbed(description) {
  return new EmbedBuilder().setColor(0x57f287).setDescription(`${description}`);
}

function errorEmbed(description) {
  return new EmbedBuilder().setColor(0xed4245).setDescription(`${description}`);
}

function infoEmbed(description, title = null) {
  const e = new EmbedBuilder().setColor(0x5865f2).setDescription(description);
  if (title) e.setTitle(title);
  return e;
}

function warnEmbed(description) {
  return new EmbedBuilder().setColor(0xfee75c).setDescription(`${description}`);
}

module.exports = { successEmbed, errorEmbed, infoEmbed, warnEmbed };
