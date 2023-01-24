const { SlashCommandBuilder } = require("discord.js");
const data = require("../data/champions").champions;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Returns random champion from your roles"),
  async execute(interaction) {
    console.log(data);
  },
};
