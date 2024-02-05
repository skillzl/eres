const Command = require('../../structures/CommandClass');

const fetch = require('node-fetch');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Dog extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('dog')
				.setDescription('Sends a random dog image')
				.setDMPermission(false),
			usage: 'dog',
			category: 'Images',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Run the function
 * @param {Client} client - The client object
 * @param {Interaction} interaction - The interaction object
 */
	async run(client, interaction) {
	// Check if SKILLZL_API_KEY is missing or empty in .env file
		if (!process.env.SKILLZL_API_KEY || process.env.SKILLZL_API_KEY === '') {
			return interaction.reply(`${client.emoji.red_emoji} Missing \`SKILLZL_API_KEY\` in .env file.`);
		}

		// Fetch a random dog image from the API
		const result = await fetch(`https://api.skillzl.dev/dog/?key=${process.env.SKILLZL_API_KEY}`).then((res) => res.json());

		// Create an embed to display the dog image
		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle('dog 🐕')
			.setURL(result.url)
			.setImage(result.url)
			.setFooter({
				text: 'api.skillzl.dev',
			});

		// Reply to the interaction with the embed
		await interaction.reply({ embeds: [embed] });
	}
};