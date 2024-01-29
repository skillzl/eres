const { SlashCommandBuilder } = require('discord.js');
const Command = require('../../structures/CommandClass');

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('ping2')
				.setDescription('Check the bot\'s ping.'),
			usage: 'ping2',
			category: 'Utilities',
			permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
		});
	}

	async run(client, interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		const latency = sent.createdTimestamp - interaction.createdTimestamp;

		interaction.editReply(`🏓 satency: ${client.ws.ping}ms`);
	}
};
