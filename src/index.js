require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

require('./Handlers/eventHandler.js')(client);
require('./Handlers/commandHandler.js')(client);

client.login(process.env.TOKEN);
