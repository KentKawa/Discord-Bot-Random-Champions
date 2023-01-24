const {
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("summonercheck")
    .setDescription("Returns a summoner info"),
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("summonerNameModal")
      .setTitle("Summoner name");
    const summonerNameInput = new TextInputBuilder()
      .setCustomId("summonerNameInput")
      .setLabel("Summoners Name")
      .setStyle(TextInputStyle.Short);

    const firstRow = new ActionRowBuilder().addComponents(summonerNameInput);

    modal.addComponents(firstRow);

    await interaction.showModal(modal);
  },
};
