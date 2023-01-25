const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const data = require("../data/champions").champions;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Returns random champion from your roles"),
  async execute(interaction) {
    const memberRole = [];
    const reducedChampions = [];

    await interaction.member.roles.cache.forEach((r) => {
      if (
        r.name === "Top" ||
        r.name === "Jungle" ||
        r.name === "Mid" ||
        r.name === "ADC" ||
        r.name === "Support"
      ) {
        memberRole.push(r.name);
      }
    });

    if (memberRole.length) {
      for (let role of memberRole) {
        data.reduce((champions, cur, index) => {
          if (cur.role.includes(role)) {
            if (!reducedChampions.includes(cur)) {
              reducedChampions.push(cur);
            }
          }
        });
      }

      // console.log("REDUCEDCHAMPS", reducedChampions);
      // console.log("MEMBER ROLE", memberRole);

      const randomChampion =
        reducedChampions[Math.floor(Math.random() * reducedChampions.length)];
      console.log(randomChampion);

      const embed = new EmbedBuilder()
        .setTitle(`${randomChampion.name} ${randomChampion.title}`)
        .setURL(`https://www.op.gg/champions/${randomChampion.name}`)
        .setDescription("Your random champ")
        .setColor(0x18e1ee)
        .setThumbnail(`${randomChampion.icon}`);

      return interaction.reply({ embeds: [embed] });
    } else {
      const randomChampion = data[Math.floor(Math.random() * data.length)];

      const embed = new EmbedBuilder()
        .setTitle(`${randomChampion.name} ${randomChampion.title}`)
        .setURL(`https://www.op.gg/champions/${randomChampion.name}`)
        .setDescription("Your random champ")
        .setColor(0x18e1ee)
        .setThumbnail(`${randomChampion.icon}`);

      return interaction.reply({ embeds: [embed] });
    }
  },
};
