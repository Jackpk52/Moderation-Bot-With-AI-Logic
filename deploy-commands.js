const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const prompt = require("./prompt");

const TOKEN = prompt.token;
const CLIENT_ID = prompt.clientId;

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ Missing token or clientId in prompt.js");
  process.exit(1);
}

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!"
  },
  {
    name: "kick",
    description: "Kick a user",
    options: [
      {
        name: "user",
        description: "The user to kick",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
  {
    name: "ban",
    description: "Ban a user",
    options: [
      {
        name: "user",
        description: "The user to ban",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
  {
    name: "unban",
    description: "Unban a user by ID",
    options: [
      {
        name: "userid",
        description: "The ID of the user to unban",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  {
    name: "mute",
    description: "Mute (timeout) a user",
    options: [
      {
        name: "user",
        description: "The user to mute",
        type: ApplicationCommandOptionType.User,
        required: true
      },
      {
        name: "minutes",
        description: "Duration of mute in minutes",
        type: ApplicationCommandOptionType.Integer,
        required: true
      }
    ]
  },
  {
    name: "unmute",
    description: "Remove timeout from a user",
    options: [
      {
        name: "user",
        description: "The user to unmute",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
  {
    name: "warn",
    description: "Warn a user",
    options: [
      {
        name: "user",
        description: "The user to warn",
        type: ApplicationCommandOptionType.User,
        required: true
      },
      {
        name: "reason",
        description: "Reason for the warning",
        type: ApplicationCommandOptionType.String,
        required: false
      }
    ]
  },
  {
    name: "warns",
    description: "Check warnings for a user",
    options: [
      {
        name: "user",
        description: "The user to check",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
  {
    name: "clearwarns",
    description: "Clear warnings for a user",
    options: [
      {
        name: "user",
        description: "The user to clear warnings for",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("⏳ Deploying commands globally...");

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Slash commands deployed globally!");
  } catch (err) {
    console.error("❌ Error deploying commands:", err);
  }
})();

