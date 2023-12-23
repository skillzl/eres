const Command = require('../../structures/CommandClass');

const fetch = require('node-fetch');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Dog extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('dog')
				.setDescription('Sends a random dog image.')
				.setDMPermission(false),
			usage: 'dog',
			category: 'Fun',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		if (!process.env.SKILLZL_API_KEY || process.env.SKILLZL_API_KEY === '') {
			return interaction.reply('<:red_emoji:1126936340022435963> Missing `SKILLZL_API_KEY` in .env file.');
		}

		const result = await fetch(`https://api.skillzl.dev/dog/?key=${process.env.SKILLZL_API_KEY}`).then((res) => res.json());

		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle('dog 🐕')
			.setURL(result.url)
			.setImage(result.url)
			.setFooter({
				text: 'api.skillzl.dev',
			});

		await interaction.reply({ embeds: [embed] });
	}
};