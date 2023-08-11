const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Whois extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('whois')
				.setDescription('Fetches a user\'s information. If no user is given, your own information will be displayed')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(true),
			usage: 'whois',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const user = interaction.options.getUser('target') || interaction.user;

		function daysAgo(time) {
			const today = new Date();
			const createdOn = new Date(time);
			const msInDay = 24 * 60 * 60 * 1000;

			createdOn.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diff = (+today - +createdOn) / msInDay;

			return diff;
		}

		const activityType = [
			'Playing',
			'Straming',
			'Listening to',
			'Watching',
			'Custom',
			'Competing in',
		];

		const member = interaction.guild.members.cache.get(user.id);
		const roles = member.roles.cache.map(r => `${r}`).join(', ').substring(0, 248);

		const _createdAt = new Date(user.createdAt);
		const _joinedAt = new Date(member.joinedAt);

		const embed = new EmbedBuilder()
			.setColor(0x36393e)
			.setTitle(`${user.username}`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }))
			.setDescription(`ID: ${user.id}`)
			.addFields(
				{ name: 'SYSTEM USER', value: user.system ? '<:green_emoji:1126936345043030026>' : '<:red_emoji:1126936340022435963>', inline: true },
				{ name: 'NICKNAME', value: user.nickname ? user.nickname : user.username, inline: true },
				{ name: 'BOOSTING', value: user.premiumSince?.toLocaleDateString('en-US') || 'Not Boosting', inline: true },
				{ name: 'ROLES', value: roles, inline: true },
				{ name: 'TYPE', value: user.bot ? 'Bot' : 'Human', inline: true },
				{ name: 'PRESENCE', value: user.presence?.activites.map(activity => `${activityType[activity.type]} ${activity.name}`).join('\n') || 'none', inline: true },
				{ name: 'CREATED ON', value: `<t:${Math.floor(_createdAt / 1000) + 3600}:F>` + `\n${daysAgo(user.createdAt).toFixed(0)} (days ago)`, inline: true },
				{ name: 'JOINED AT', value: `<t:${Math.floor(_joinedAt / 1000) + 3600}:F>` + `\n${daysAgo(member.joinedAt).toFixed(0)} (days ago)`, inline: true },
			);

		await interaction.reply({ embeds: [embed] });

	}
};