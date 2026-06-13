# Discord Bot

A full-featured Discord bot built with discord.js v14.

## Features

**Moderation**
- `/ban` — Ban a member (with optional message purge)
- `/unban` — Unban by user ID
- `/kick` — Kick a member
- `/mute` — Timeout a member (supports 10m, 1h, 7d format)
- `/unmute` — Remove timeout
- `/warn add/list/clear/remove` — Full warning system
- `/purge` — Bulk delete messages (1–100)
- `/slowmode` — Set channel slowmode
- `/lock channel / unlock` — Lock/unlock channels

**AutoMod** (automatic, no setup required)
- Anti-spam (5 messages in 5 seconds)
- Anti-invite link
- Anti-mass mention (5+ mentions)
- Custom banned words list
- Auto-timeout at 3 warnings, auto-ban at 5

**Info**
- `/userinfo` — User details and roles
- `/serverinfo` — Server stats
- `/avatar` — Display user avatar
- `/roleinfo` — Role details

**Utility**
- `/ping` — Bot latency
- `/role add/remove` — Manage member roles
- `/embed` — Send custom embed messages
- `/help` — Interactive command menu

**Fun**
- `/8ball` — Magic 8-ball
- `/coinflip` — Coin flip
- `/dice` — Roll custom dice
- `/rps` — Rock Paper Scissors
- `/joke` — Random joke

**AI Assistant**
- `/ask` — Ask the built-in AI a question (math, Discord help, general knowledge)
- `/translate` — English <-> Vietnamese translation

**Logging** (set with `/automod setlog #channel`)
- Member join/leave
- Message delete
- Message edit

---

## Setup Guide

### 1. Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click **New Application** — give it a name
3. Go to **Bot** tab → click **Add Bot**
4. Copy the **Token** (keep it secret!)
5. Enable **Message Content Intent**, **Server Members Intent**, **Presence Intent**
6. Go to **OAuth2 > URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Administrator` (or select manually)
7. Use the generated URL to invite the bot to your server

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in:

```
TOKEN=your_bot_token_here
CLIENT_ID=your_application_id
GUILD_ID=your_server_id   (optional, for instant command deploy)
```

To find your Client ID: Developer Portal → Your App → General Information → Application ID  
To find Guild ID: Right-click your server icon → Copy Server ID (enable Developer Mode first)

### 3. Install Dependencies

```bash
npm install
```

### 4. Deploy Slash Commands

```bash
node deploy.js
```

> If you set `GUILD_ID`, commands appear instantly. Without it, global deploy takes up to 1 hour.

### 5. Start the Bot

```bash
npm start
```

---

## Deploying on bot-hosting.net

1. Upload all files (or connect via GitHub)
2. Set environment variables in the hosting dashboard:
   - `TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID` (optional)
3. Set start command: `node index.js`
4. Run `node deploy.js` once from the console to register slash commands
5. Start the bot

> **Note:** The in-memory database resets on restart. For persistent warnings/configs, upgrade `utils/database.js` to use `better-sqlite3` or a cloud MongoDB.

---

## Upgrading to Persistent Database

Replace `utils/database.js` with SQLite:

```bash
npm install better-sqlite3
```

Then update the database functions to use SQL queries instead of in-memory objects.
