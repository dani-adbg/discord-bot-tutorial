const { Events, Client } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(`${client.user.tag} esta listo y conectado!!!`);
  },
};
