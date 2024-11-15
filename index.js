require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', (client) => {
  console.log(`Bot ${client.user.tag} conectado!!!`);
});

const commands = [
  {
    name: 'comando',
    description: 'Primer Comando',
  },
  {
    name: 'ping',
    description: 'Replies the command with pong!',
  },
];

const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

try {
  console.log('Estableciendo los comandos de /');
  rest
    // TODOS LOS SERVIDORES
    // .put(Routes.applicationCommands('app-id'), {
    //   body: commands,
    // })

    // UN SOLO SERVIDOR
    .put(Routes.applicationGuildCommands('app-id', 'server-id'), {
      body: commands,
    })
    .then(() => {
      console.log('Comandos de / establecidos correctamente');
    });
} catch (error) {
  console.error(error);
}

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'comando') {
    interaction.reply({ content: 'Comando numero 1' });
  } else if (interaction.commandName === 'ping') {
    interaction.reply({ content: 'pong!' });
  }
});

const prefix = '#';

client.on('messageCreate', (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.reply({ content: 'pong!' });
  } else if (command === 'say') {
    const text = args.join(' ');
    message.channel.send({ content: text });
  }
});

client.login(process.env.TOKEN);
