const Command = require('../../structures/CommandClass');

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Returns the bot ping')
				.setDMPermission(true),
			usage: 'ping',
			category: 'Info',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const now = Date.now();
		await interaction.deferReply();

		const pingEmbed = new EmbedBuilder()
			.setAuthor({
				name: 'process ping',
				iconURL: client.user.displayAvatarURL({ size: 2048 }),
			})
			.setColor(0x36393e)
			.setDescription(stripIndents`
            ⏱ roundtrip: **${Math.round(Date.now() - now)} ms**
            💓 api: **${Math.round(client.ws.ping)} ms**
            `);

		return await interaction.followUp({ embeds: [pingEmbed] });
	}
};