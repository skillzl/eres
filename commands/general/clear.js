const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('clear')
				.setDescription('Deletes a bulk of specified messages.')
				.setDMPermission(false),
			usage: 'clear',
			category: 'Moderation',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const inputAmount = interaction.options.getNumber("amount");

		const previousMessages = await interaction.channel.messages.fetch({ "limit": 1 });

			const messages = await interaction.channel.messages.fetch({
				"limit": inputAmount,
				"before": previousMessages.first().id
			});

			await interaction.channel.bulkDelete(messages, true);
			await interaction.reply(interaction.client.translate.commands.purge.message_cleared.replace("%s", messages.size));
	}
};
