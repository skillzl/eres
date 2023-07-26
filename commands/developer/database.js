const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const db = require('../../database/manager');

module.exports = class Database extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('database')
				.setDescription('Change mongoose database values.')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(true))
				.addStringOption(option =>
					option.setName('type')
						.setDescription('Database field (e.g. xp, balance, reputation)')
						.setRequired(true))
				.addNumberOption((option) =>
					option.setName('value')
						.setDescription('Data value (min: 1 max: 9999999)')
						.setMinValue(1)
						.setMaxValue(9999999)
						.setRequired(true))
				.setDMPermission(false),
			usage: 'database',
			category: 'Developer',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		if (interaction.user.id !== process.env.DEVELOPER_ID) return interaction.reply('Missing `DEVELOPER` permission.');

		const member = interaction.options.getUser('target');
		const type = interaction.options.getString('type');
		const value = interaction.options.getNumber('value');

		switch (type) {
		case 'xp': {
			const { user } = await db.getUserById(member.id);

			await db.updateUserById(member.id, {
				xp: user.xp + Number(value),
			});

			return interaction.reply(
				`<:green_emoji:1126936345043030026> Successfully added \`${value}\` exp to ${member.username}.`,
			);
		}
		case 'balance': {
			const { user } = await db.getUserById(member.id);

			await db.updateUserById(member.id, {
				balance: user.balance + Number(value),
			});
			return interaction.reply(
				`<:green_emoji:1126936345043030026> Successfully added \`${value}\` coins to ${member.username}.`,
			);
		}
		case 'reputation': {
			const { user } = await db.getUserById(member.id);

			await db.updateUserById(member.id, {
				reputation: user.reputation + Number(value),
			});
			return interaction.reply(
				`<:green_emoji:1126936345043030026> Successfully added \`${value}\` reputation points to ${member.username}.`,
			);
		}
		default: {
			return interaction.reply(`<:red_emoji:1126936340022435963> Error: \`${type}\` is not a valid type.`);
		}
		}
	}
};