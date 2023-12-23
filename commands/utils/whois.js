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
			STAFF: '<:staff_badge:1139567579371946064>',
			PARTNER: '<:partner_badge:1139567761287282698>',
			HYPESQUAD: '<:hypesquad_badge:1139568237764427806>',
			BUG_HUNTER_LEVEL_1: '<:bughunter_level1_badge:1139571311534931978>',
			BUG_HUNTER_LEVEL_2: '<:bughunter_level2_badge:1139571316542947468>',
			HYPESQUAD_ONLINE_HOUSE_1: '<:house1_badge:1139571326621843496>',
			HYPESQUAD_ONLINE_HOUSE_2: '<:house2_badge:1139571331671793685>',
			HYPESQUAD_ONLINE_HOUSE_3: '<:house3_badge:1139571337136963695>',
			PREMIUM_EARLY_SUPPORTER: '<:early_supporter_badge:1139571489671229631>',
			SYSTEM: '<:system_badge:1139571345039036487>',
			VERIFIED_BOT: '<:verified_bot_badge:1139571349262696509>',
			VERIFIED_DEVELOPER: '<:verified_developer_badge:1139571354325237790>',
			CERTIFIED_MODERATOR: '<:certified_moderator_badge:1139571322368835685>',
			ACTIVE_DEVELOPER: '<:active_developer_badge:1139571306313039872>',
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
				{ name: 'SYSTEM USER', value: user.system ? '<:green_emoji:1126936345043030026>' : '<:red_emoji:1126936340022435963>', inline: true },
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