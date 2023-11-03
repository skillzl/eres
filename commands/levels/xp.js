const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Xp extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('xp')
				.setDescription('Fetch the current xp points an user have')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'xp [user]',
			category: 'Levels',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target') || interaction.user;
		const { user } = await db.getUserById(member.id);

		interaction.reply(`<:star_emoji:1126279940321574913> ${member.username} has earned **${user.xp.toLocaleString()}** xp points.`);
	}
};