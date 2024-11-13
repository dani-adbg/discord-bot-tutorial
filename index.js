require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const prefix = '!';

const player = new Player(client);

player.extractors
  .register(YoutubeiExtractor)
  .then(() => {
    console.log('Youtuebe Cargado');
  })
  .catch((e) => console.log(e));

player.events.on('playerStart', (queue, track) => {
  // Emitted when the player starts to play a song
  queue.metadata.channel.send(`Started playing: **${track.title}**`);
});

player.events.on('audioTrackAdd', (queue, track) => {
  // Emitted when the player adds a single song to its queue
  queue.metadata.channel.send(`Track **${track.title}** queued`);
});

player.events.on('audioTracksAdd', (queue, track) => {
  // Emitted when the player adds multiple songs to its queue
  queue.metadata.channel.send(`Multiple Track's queued`);
});

player.events.on('playerSkip', (queue, track) => {
  // Emitted when the audio player fails to load the stream for a song
  queue.metadata.channel.send(`Skipping **${track.title}** due to an issue!`);
});

player.events.on('disconnect', (queue) => {
  // Emitted when the bot leaves the voice channel
  queue.metadata.channel.send('Looks like my job here is done, leaving now!');
});
player.events.on('emptyChannel', (queue) => {
  // Emitted when the voice channel has been empty for the set threshold
  // Bot will automatically leave the voice channel with this event
  queue.metadata.channel.send(`Leaving because no vc activity for the past 5 minutes`);
});
player.events.on('emptyQueue', (queue) => {
  // Emitted when the player queue has finished
  queue.metadata.channel.send('Queue finished!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.reply({ content: 'pong!' });
  } else if (command === 'play') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('No estas conectado a un canal de voz');

    const result = args.join(' ');

    if (!result) return message.channel.send('Ingresa algo para buscar');

    player.play(voiceChannel, result, {
      nodeOptions: {
        metadata: {
          channel: message.channel,
        },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000,
      },
    });
  } else if (command === 'stop') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('No estas conectado a un canal de voz');

    const queue = player.queues.get(message.guild);

    if (!queue) return message.channel.send('no hay una lista reproduciendose');

    message.channel.send('STOP');
    queue.delete();
    queue.node.stop();
  } else if (command === 'queue') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('No estas conectado a un canal de voz');

    const queue = player.queues.get(message.guild);

    if (!queue) return message.channel.send('no hay una lista reproduciendose');

    const history = queue.history.tracks.data.map((x) => x.title);
    const nextSongs = queue.tracks.data.map((x) => x.title);

    const list = [...history, `> ${queue.currentTrack.title}`, ...nextSongs];

    message.channel.send(`Lista del Servidor ${message.guild.name}\n${list.join('\n')}`);
  } else if (command === 'pause') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('No estas conectado a un canal de voz');

    const queue = player.queues.get(message.guild);

    if (!queue) return message.channel.send('no hay una lista reproduciendose');

    if (queue.node.isPaused()) return message.channel.send('La musica ya esta pausada');

    queue.node.pause();
    message.channel.send('Pausado');
  } else if (command === 'resume') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('No estas conectado a un canal de voz');

    const queue = player.queues.get(message.guild);

    if (!queue) return message.channel.send('no hay una lista reproduciendose');

    if (!queue.node.isPaused()) return message.channel.send('La musica ya se esta reproduciendo');

    queue.node.resume();
    message.channel.send('Resumido');
  } else if (command === 'skip') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('No estas conectado a un canal de voz');

    const queue = player.queues.get(message.guild);

    if (!queue) return message.channel.send('no hay una lista reproduciendose');

    queue.node.skip();
    message.channel.send('Musica Saltada');
  }
});

client.login(process.env.TOKEN);
