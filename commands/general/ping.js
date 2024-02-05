const Command = require('../../structures/CommandClass');

const { stripIndents } = require('common-tags');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Returns the bot ping')
				.setDMPermission(false),
			usage: 'ping',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}

	/**
 * Runs the ping command.
 *
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object.
 * @returns {Promise<Message>} - A promise that resolves to the message sent.
 */
	async run(client, interaction) {
	// Get the current timestamp
		const now = Date.now();

		// Defer the reply to the interaction
		await interaction.deferReply();

		// Create the ping embed
		const pingEmbed = new EmbedBuilder()
			.setAuthor({
				name: 'process ping',
				iconURL: client.user.displayAvatarURL({ size: 2048 }),
			})
			.setColor(0x36393e)
			.setDescription(stripIndents`
           ${client.emoji.clock} roundtrip: **${Math.round(Date.now() - now)} ms**
           ${client.emoji.heartbeat} api: **${Math.round(client.ws.ping)} ms**
           `);

		// Send the ping embed as a reply to the interaction
		return await interaction.followUp({ embeds: [pingEmbed] });
	}
};
