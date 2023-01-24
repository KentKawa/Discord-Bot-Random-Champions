const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rolesselect")
    .setDescription("This is to select roles"),
  async execute(interaction) {
    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setMinValues(1)
        .setMaxValues(2)
        .setPlaceholder("Select a role")
        .addOptions(
          {
            label: "Top",
            description: "This is Top lane",
            value: "Top",
          },
          {
            label: "Jungle",
            description: "This is Jungle lane",
            value: "Jungle",
          },
          {
            label: "Mid",
            description: "This is Mid lane",
            value: "Mid",
          },
          {
            label: "ADC",
            description: "This is Bot lane",
            value: "ADC",
          },
          {
            label: "Support",
            description: "This is Support lane",
            value: "Support",
          }
        )
    );
    await interaction.reply({
      content: "Role selection menu",
      ephemeral: true,
      components: [menu],
    });
  },
};
