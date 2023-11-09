const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ranks = require("../ranks.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Retrieve player statistics from tankionline.')
		.addStringOption(option => 
			option.setName("player")
				.setDescription("Player ID")
				.setRequired(true)),
	async execute(interaction) {
		const player = interaction.options.getString("player");

		let reponse = await fetch(`https://ratings.tankionline.com/api/eu/profile/?user=${player}&lang=en`);

		let jsonR = await reponse.json();

		let imageUrl = ranks[jsonR.response.rank - 1].url;
		let rankName = ranks[jsonR.response.rank - 1].name;

		let scorePercentage = 100 / (jsonR.response.scoreNext - jsonR.response.scoreBase) * (jsonR.response.score - jsonR.response.scoreBase);
		scorePercentage = Math.round(scorePercentage * 10) / 10;

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x78FF35)
			.setTitle(jsonR.response.name)
			.setAuthor({ name: rankName, iconURL: "https://tankionline.com/en/wp-content/themes/tanki20/icon/logo_s.png" })
			.setDescription(`${jsonR.response.score}/${jsonR.response.scoreNext} ${scorePercentage}% EXP`)
			.setThumbnail(imageUrl)
			.addFields(
				{ name: 'Gear Score', value: String(jsonR.response.gearScore), inline: true },
				{ name: 'K/D', value: `${jsonR.response.kills}/${jsonR.response.deaths}`, inline: true },
				{ name: 'Gold Boxes Caught', value: String(jsonR.response.caughtGolds), inline: true },
			)
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.user.username}` });
      
		await interaction.reply({ embeds: [exampleEmbed]});
	},
};
