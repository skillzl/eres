const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Gifs extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('gifs')
				.setDescription('Sends a random 🔞 gif ')
				.setDMPermission(false)
				.setNSFW(true),
			usage: 'gifs',
			category: 'Images',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the function.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - A promise that resolves when the function is finished.
 */
	async run(client, interaction) {
		// Fetch a random 🔞 gif from the API
		const result = await fetch(`https://api.eres.fun/images/gifs?token=${process.env.API_ERES_KEY}`).then((res) => res.json());

		// Create an embed with the 🔞 gif
		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle(`${result.category} 🔞`)
			.setURL(result.url)
			.setImage(result.url)
			.setFooter({
				text: 'api.eres.fun',
			});

		// Send the embed as a reply to the interaction
		await interaction.reply({ embeds: [embed] });
	}
};