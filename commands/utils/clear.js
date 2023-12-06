const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('clear')
				.setDescription('Deletes a bulk of specified messages')
				.addNumberOption((option) =>
					option.setName('number')
						.setDescription('Messages count (min: 2 max: 100)')
						.setMinValue(2)
						.setMaxValue(100)
						.setRequired(true))
				.setDMPermission(false),
			usage: 'clear [number]',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links', 'Manage Messages'],
		});
	}
	async run(client, interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply('You are missing `MANAGE_MESSAGES` permission.');

		const number = interaction.options.getNumber('number');

		const fetched = await interaction.channel.messages.fetch({ limit: number });
		await interaction.channel.bulkDelete(fetched).then(interaction.reply(`<:green_emoji:1126936345043030026> Deleted ${number} messages.`).then(reply => {
			setTimeout(() => {
				reply.delete();
			}, 2000);
		}));
	}
};