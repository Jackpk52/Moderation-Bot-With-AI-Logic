const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const promptData = require("./prompt");
const { askAI } = require("./ai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 🛠️ Moderation Commands
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

  const args = message.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "kick") {
    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention a user to kick!");
    await user.kick();
    message.reply(`👢 Kicked ${user.user.tag}`);
  }

  if (command === "ban") {
    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention a user to ban!");
    await user.ban();
    message.reply(`🔨 Banned ${user.user.tag}`);
  }

  if (command === "mute") {
    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention a user to mute!");
    await user.timeout(10 * 60 * 1000); // 10 min
    message.reply(`🔇 Muted ${user.user.tag} for 10 minutes`);
  }

  if (command === "clear") {
    const count = parseInt(args[0]);
    if (!count) return message.reply("❌ Provide number of messages to delete!");
    await message.channel.bulkDelete(count);
    message.channel.send(`🧹 Deleted ${count} messages!`);
  }

  if (command === "clearwarning") {
    message.reply("⚠️ Warnings cleared (fake example, needs DB if real).");
  }
});

// 💡 AI Reply on Mention
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    const question = message.content.replace(/<@!?(\d+)>/, "").trim();

    if (!question) {
      return message.reply("🤖 You mentioned me, but didn’t ask anything!");
    }

    await message.channel.send("💭 Thinking...");
    const answer = await askAI(question);
    await message.reply(answer);
  }
});

client.login(promptData.token);
