const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    interaction.reply({ content: `${interaction.user.username} pong!` });
  },
};
