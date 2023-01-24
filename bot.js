require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { TOKEN, RIOT_KEY } = process.env;
const {
  GatewayIntentBits,
  Client,
  Events,
  Collection,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" of "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.reply({
      content: "there was an error while executing this command",
      ephemeral: true,
    });
  }

  console.log(interaction);
});

//Command to add role
//TOP 1065357331874975805
//JUNGLE 1065356753098776616
//MID 1065357011249811537
//ADC 1065357124135292969
//SUPPORT 1065357242808934500
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "select") {
    let selectedRoles = "";

    await interaction.member.roles.cache.forEach((r) => {
      if (
        r.id === "1065357331874975805" ||
        r.id === "1065356753098776616" ||
        r.id === "1065357011249811537" ||
        r.id === "1065357124135292969" ||
        r.id === "1065357242808934500"
      ) {
        interaction.member.roles.remove(r.id);
      }
    });

    await interaction.values.forEach(async (value) => {
      let role = interaction.guild.roles.cache.find(
        (role) => role.name === `${value}`
      );
      selectedRoles += `${value} `;
      interaction.member.roles.add(role);
    });
    interaction.reply({
      content: `${interaction.user.username} has changed thier roles to ${selectedRoles}.`,
      components: [],
    });
  }
});

//Checks summoner
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  const summoner = interaction.fields.getTextInputValue("summonerNameInput");

  const summonerResponse = await fetch(
    "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
      encodeURIComponent(summoner),
    { headers: { "X-Riot-Token": RIOT_KEY } }
  ).then((res) => res.json());
  if (summonerResponse) {
    console.log(summonerResponse);
    let summonerID = summonerResponse.id;
    let summonerLevel = summonerResponse.summonerLevel;
    let summonerIcon = summonerResponse.profileIconId;
    const leagueResponse = await fetch(
      `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}`,
      { headers: { "X-Riot-Token": RIOT_KEY } }
    ).then((res) => res.json());
    if (leagueResponse) {
      for (let type of leagueResponse) {
        if (type.queueType === "RANKED_SOLO_5x5") {
          let summonerRank = type.rank;
          let summonerTier = type.tier;
          let summonerWins = type.wins;
          let summonerLosses = type.losses;
          console.log(
            summonerRank,
            summonerTier,
            Math.round((summonerWins / (summonerWins + summonerLosses)) * 100)
          );
          const image = new AttachmentBuilder(`./assets/${summonerTier}.png`);
          const embed = new EmbedBuilder()
            .setTitle("Summoner Info")
            .setURL(
              `https://www.op.gg/summoners/na/${encodeURIComponent(summoner)}`
            )
            .setDescription("Check if you should flame them or not")
            .setColor(0x18e1ee)
            .setImage(`attachment://${summonerTier}.png`)
            .setThumbnail(
              `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${summonerIcon}.png`
            )
            .addFields([
              { name: `${summoner}`, value: "\u200B" },
              {
                name: `Level: ${summonerLevel}`,
                value: `Solo Rank: ${summonerTier} ${summonerRank}`,
              },
              { name: "Wins", value: `${summonerWins}`, inline: true },
              { name: "Losses", value: `${summonerLosses}`, inline: true },
              {
                name: "Percent",
                value: `${Math.round(
                  (summonerWins / (summonerWins + summonerLosses)) * 100
                )}%`,
                inline: true,
              },
            ]);

          return interaction.reply({ embeds: [embed], files: [image] });
        } else if (type.queueType === "RANKED_TEAM_5v5") {
          let summonerRank = type.rank;
          let summonerTier = type.tier;
          let summonerWins = type.wins;
          let summonerLosses = type.losses;
          console.log(
            summonerRank,
            summonerTier,
            Math.round((summonerWins / (summonerWins + summonerLosses)) * 100)
          );
          const image = new AttachmentBuilder(`./assets/${summonerTier}.png`);
          const embed = new EmbedBuilder()
            .setTitle("Summoner Info")
            .setURL(
              `https://www.op.gg/summoners/na/${encodeURIComponent(summoner)}`
            )
            .setDescription("Check if you should flame them or not")
            .setColor(0x18e1ee)
            .setImage(`attachment://${summonerTier}.png`)
            .setThumbnail(
              `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${summonerIcon}.png`
            )
            .addFields([
              { name: `${summoner}`, value: "\u200B" },
              {
                name: `Level: ${summonerLevel}`,
                value: `Flex Rank: ${summonerTier} ${summonerRank}`,
              },
              { name: "Wins", value: `${summonerWins}`, inline: true },
              { name: "Losses", value: `${summonerLosses}`, inline: true },
              {
                name: "Percent",
                value: `${Math.round(
                  (summonerWins / (summonerWins + summonerLosses)) * 100
                )}%`,
                inline: true,
              },
            ]);

          return interaction.reply({ embeds: [embed], files: [image] });
        }
      }
      const embed = new EmbedBuilder()
        .setTitle("Summoner Info")
        .setURL(
          `https://www.op.gg/summoners/na/${encodeURIComponent(summoner)}`
        )
        .setDescription("Check if you should flame them or not")
        .setColor(0x18e1ee)
        .setThumbnail(
          `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${summonerIcon}.png`
        )
        .addFields([
          { name: `${summoner}`, value: "\u200B" },
          {
            name: `Level: ${summonerLevel}`,
            value: `Have no rank this season.`,
          },
        ]);
      return interaction.reply({ embeds: [embed] });
    }
  }
  return interaction.reply({
    content: `${summoner} does not exist in NA`,
    ephemeral: true,
  });
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);
