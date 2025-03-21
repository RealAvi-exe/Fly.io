require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, './commands');
fs.readdirSync(commandsPath).forEach(file => {
  const command = require(\`\${commandsPath}/\${file}\`);
  client.commands.set(command.name, command);
});
client.once('ready', () => {
  console.log(\`Logged in as \${client.user.tag}\`);
});
client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(process.env.PREFIX)) return;
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (command) command.execute(message, args);
});
client.login(process.env.TOKEN);
