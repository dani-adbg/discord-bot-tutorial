const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('user').setDescription('Replies with user information!'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.tag} information`)
      .setColor('Random')
      .addFields({
        name: 'id',
        value: interaction.user.id,
      })
      .setTimestamp()
      .setFooter({ text: `${interaction.guild.name}` });

    interaction.reply({ content: `${interaction.user.username} information!`, embeds: [embed] });
  },
};
