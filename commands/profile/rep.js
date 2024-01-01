const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const ms = require('ms');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class Reputation extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('rep')
				.setDescription('Give a reputation point to a user')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(true))
				.setDMPermission(false),
			usage: 'rep [user]',
			category: 'Profile',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target');

		const timeout = 86400000;
		const amount = 1;
		const { user } = await db.getUserById(interaction.user.id);

		const { user: receiver } = await db.getUserById(member.id);
		const { user: sender } = await db.getUserById(interaction.user.id);

		if (receiver.userId === sender.userId) {
			return interaction.reply('You cannot give yourself an extra reputation point.');
		}

		if (user.reputation_cooldown !== null && timeout - (Date.now() - user.reputation_cooldown) > 0) {
			const time = ms(timeout - (Date.now() - user.reputation_cooldown), {
				long: true,
			});

			interaction.reply(`You've already used the rep command recently, \`${time}\` remaining.`);
		}
		else {
			db.updateUserById(member.id, {
				reputation: receiver.reputation + amount,
			});

			db.updateUserById(interaction.user.id, {
				reputation_cooldown: Date.now(),
			});

			interaction.reply(`${client.emoji.green_emoji} You gave a reputation point to ${member.username}!`);
		}
	}
};
