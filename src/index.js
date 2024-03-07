// REQUIRE FUNCIONES DE DISCORD
const { Client, GatewayIntentBits } = require('discord.js');
// REQUIERE TOKENS
require('dotenv').config();

// CREA EL CLIENTE
const client = new Client({ intents: [
  // INFORMACIÓNB DE LOS SERVIDORES
  GatewayIntentBits.Guilds,
  // MENSAJES
  GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages
]});

// ARRAY DE COMANDOS QUE SE REGISTRARÁN
const commands = [
  {
    name: 'ping',
    description: 'Comando Ping'
  }
]

// MOSTRAR CUANDO SE ENCIENDE EL BOT
client.once('ready', () => {
  // REGISTRA UNA PRESENCIA AL BOT
  client.user.setPresence({ activities: [{ name: "Viendo mi primera versión" }], status: 'online' });
  // REGISTRAR GLOBALMENTE
  // client.application.commands.set(commands);

  // REGISTRAR POR SERVIDOR
  client.guilds.fetch('1102771262960447549').then(guild => {
    // ELIMINA LOS COMANDOS
    guild.commands.set([]);
    // REGISTRA LOS COMANDOS
    guild.commands.set(commands);
  });
  console.log(`Cliente ${client.user.tag} iniciado correctamente`);
});

// EVENTO DE INTERACTIONCREATE
client.on('interactionCreate', (interaction) => {
  // SI NO ES UN SLASHCOMMAND NO FUNCIONA
  if(!interaction.isChatInputCommand()) return;

  // SI EL COMANDO ES IGUAL A PING EJECUTA
  if(interaction.commandName === 'ping') {
    interaction.reply({ content: 'pong!' });
  };
});

// EVENTO DE MESSAGECREATE
client.on('messageCreate', (message) => {
  // SI EL MENSAJE NO EMPIEZA CON EL PREFIJO O EL AUTOR DEL MENSAJE ES UN BOT NO DEVUELVE NADA
  if(!message.content.startsWith('-') || message.author.bot) return;

  // OBTIENE LOS ARGUMENTOS DEL MENSAJE Y LO DIVIDE
  const args = message.content.slice(1).trim().split(/ +/);

  // OBTIENE EL NOMBRE DEL COMANDO
  const commandName = args.shift().toLowerCase();

  // SI EL COMANDO ES PONG EJECUTA
  if(commandName === 'pong') {
    message.reply({ content: 'ping!' });
  };
});

// INICIA EL BOT
client.login(process.env.TOKEN);
