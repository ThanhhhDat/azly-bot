// Simple in-memory database
// For production, replace with SQLite (better-sqlite3) or MongoDB

const warnings = {};   // { guildId: { userId: [{reason, date}] } }
const configs = {};    // { guildId: { automod config } }
const logChannels = {}; // { guildId: channelId }

// --- Warnings ---
function addWarning(guildId, userId, reason) {
  if (!warnings[guildId]) warnings[guildId] = {};
  if (!warnings[guildId][userId]) warnings[guildId][userId] = [];
  warnings[guildId][userId].push({ reason, date: new Date().toISOString() });
  return { count: warnings[guildId][userId].length };
}

function getWarnings(guildId, userId) {
  return warnings[guildId]?.[userId] || [];
}

function clearWarnings(guildId, userId) {
  if (warnings[guildId]) delete warnings[guildId][userId];
}

function removeWarning(guildId, userId, index) {
  if (!warnings[guildId]?.[userId]) return false;
  if (index < 0 || index >= warnings[guildId][userId].length) return false;
  warnings[guildId][userId].splice(index, 1);
  return true;
}

// --- AutoMod Config ---
function getAutomodConfig(guildId) {
  if (!configs[guildId]) {
    configs[guildId] = {
      antiSpam: true,
      antiInvite: true,
      antiMassMention: true,
      bannedWords: [],
    };
  }
  return configs[guildId];
}

function setAutomodConfig(guildId, key, value) {
  if (!configs[guildId]) getAutomodConfig(guildId);
  configs[guildId][key] = value;
}

// --- Log Channel ---
function setLogChannel(guildId, channelId) {
  logChannels[guildId] = channelId;
}

function getLogChannel(guildId) {
  return logChannels[guildId] || null;
}

module.exports = {
  addWarning, getWarnings, clearWarnings, removeWarning,
  getAutomodConfig, setAutomodConfig,
  setLogChannel, getLogChannel,
};
