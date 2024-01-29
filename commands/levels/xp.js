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
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the command when invoked by a user.
 *
 * @param {Client} client - The Discord client instance.
 * @param {Interaction} interaction - The interaction object representing the command invocation.
 */
	async run(client, interaction) {
		// Get the target user from the interaction options, or use the interaction user as the default
		const member = interaction.options.getUser('target') || interaction.user;

		// Retrieve the user data from the database based on the member's ID
		const { user } = await db.getUserById(member.id);

		// Reply to the interaction with the XP points earned by the member
		interaction.reply(`${client.emoji.star} ${member.username} has earned **${user.xp.toLocaleString()}** xp points.`);
	}
};