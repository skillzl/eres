/* eslint-disable no-mixed-spaces-and-tabs */
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
			usage: 'whois [user]',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const user = interaction.options.getUser('target') || interaction.user;
		const formatter = new Intl.ListFormat('en-US', { style: 'narrow', type: 'conjunction' });

		function daysAgo(time) {
			const today = new Date();
			const createdOn = new Date(time);
			const msInDay = 24 * 60 * 60 * 1000;

			createdOn.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diff = (+today - +createdOn) / msInDay;

			return diff;
		}

		const DISCORD_BADGES = {
			STAFF: client.emoji.staff_emoji,
			PARTNER: client.emoji.partnered_badge,
			HYPESQUAD: client.emoji.hypesquad,
			BUG_HUNTER_LEVEL_1: client.emoji.hunter_one,
			BUG_HUNTER_LEVEL_2: client.emoji.hunter_two,
			HYPESQUAD_ONLINE_HOUSE_1: client.emoji.hypesquad_house_one,
			HYPESQUAD_ONLINE_HOUSE_2: client.emoji.hypesquad_house_two,
			HYPESQUAD_ONLINE_HOUSE_3: client.emoji.hypesquad_house_tree,
			PREMIUM_EARLY_SUPPORTER: client.emoji.early_supporter,
			SYSTEM: client.emoji.discord_system,
			VERIFIED_BOT: client.emoji.verified_bot,
			VERIFIED_DEVELOPER: client.emoji.verified_developer,
			CERTIFIED_MODERATOR: client.emoji.certified_moderator,
			ACTIVE_DEVELOPER: client.emoji.active_developer,
		};

		const member = interaction.guild.members.cache.get(user.id);
		const roles = member.roles.cache.map(r => `${r}`).join(' ').substring(0, 248);

		const _createdAt = new Date(user.createdAt);
		const _joinedAt = new Date(member.joinedAt);

		const userFlags = user.flags.toArray();

		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle(`${user.username}`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }))
			.setDescription(`ID: ${user.id}`)
			.addFields(
				{ name: 'SYSTEM USER', value: user.system ? client.emoji.green_emoji : client.emoji.red_emoji, inline: true },
				{ name: 'NICKNAME', value: user.nickname ? user.nickname : user.username, inline: true },
				{ name: 'BOOSTING', value: user.premiumSince?.toLocaleDateString('en-US') || 'Not Boosting', inline: true },
				{ name: 'ROLES', value: roles, inline: true },
				{ name: 'TYPE', value: user.bot ? 'Bot' : 'Human', inline: true },
				{ name: 'BADGES', value: userFlags.lenght ? formatter.format(userFlags.map(flag => `${DISCORD_BADGES[flag]}`)) : 'None', inline: true },
			);

		if (member.presence) {
			const activities = member.presence.activities;

			if (activities.length > 0) {
				const activity = activities[0];
				let details = '';

				if (activity.name) {
					details += `${activity.name}\n`;
				}

				if (activity.details) {
					details += `${activity.details}\n`;
				}

				if (activity.state) {
					details += `${activity.state}\n`;
				}

				if (activity.timestamps && activity.timestamps.start) {
					const elapsed = Date.now() - activity.timestamps.start.getTime();
					const elapsedSec = Math.floor(elapsed / 1000);
					const elapsedMin = Math.floor(elapsedSec / 60);
					const elapsedHrs = Math.floor(elapsedMin / 60);

					details += `${elapsedHrs} hrs, ${elapsedMin % 60} mins, ${elapsedSec % 60} secs elapsed\n`;
				}

				if (details !== '') {
					embed.addFields(
						{ name: 'ACTIVITY', value: details },
					);
				}
			}
		}

		embed.addFields(
			{ name: 'CREATED ON', value: `<t:${Math.floor(_createdAt / 1000) + 3600}:F>` + `\n${daysAgo(user.createdAt).toFixed(0)} (days ago)`, inline: true },
			{ name: 'JOINED AT', value: `<t:${Math.floor(_joinedAt / 1000) + 3600}:F>` + `\n${daysAgo(member.joinedAt).toFixed(0)} (days ago)`, inline: true },
		);

		await interaction.reply({ embeds: [embed] });

	}
};