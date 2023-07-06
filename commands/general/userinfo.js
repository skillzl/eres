/* eslint-disable no-mixed-spaces-and-tabs */
const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder } = require('discord.js');
// const { stripIndents } = require('common-tags');

module.exports = class UserInfo extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('userinfo')
				.setDescription('Returns information about a user.')
				.addUserOption((option) =>
					option.setName('target').setDescription('The user').setRequired(false),
				)
				.setDMPermission(false),
			usage: 'User Info',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target') || interaction.user;

		 /* const _createdAt = new Date(member.createdAt);
		 const _joinedAt = new Date(member.joinedAt);

		const DISCORD_BADGES = {
			DISCORD_EMPLOYEE: '<:star_emoji:1126279940321574913>',
			DISCORD_PARTNER: '<:star_emoji:1126279940321574913>',
			BUGHUNTER_LEVEL_1: '<:star_emoji:1126279940321574913>',
			BUGHUNTER_LEVEL_2: '<:star_emoji:1126279940321574913>',
			HYPESQUAD_EVENTS: '<:star_emoji:1126279940321574913>',
			HOUSE_BRAVERY: '<:star_emoji:1126279940321574913>',
			HOUSE_BRILLIANCE: '<:star_emoji:1126279940321574913>',
			HOUSE_BALANCE: '<:star_emoji:1126279940321574913>',
			EARLY_SUPPORTER: '<:star_emoji:1126279940321574913>',
			VERIFIED_BOT: '<:star_emoji:1126279940321574913>',
			VERIFIED_DEVELOPER: '<:star_emoji:1126279940321574913>',
			DISCORD_CERTIFIED_MODERATOR: '<:star_emoji:1126279940321574913>',
		};

		const TARGET_BADGES = [];

		for (const flags of member.flags.toArray()) {
			TARGET_BADGES.push(DISCORD_BADGES[flags]);
		}

		function formatDate(timestamp) {
			const startTime = timestamp;
			const endTime = Date.now();
			const totalSeconds = (endTime - startTime) / 1000;

			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = Math.floor((totalSeconds % 3600) % 60);

			return `${hours >= 1 ? ('0' + hours).slice(-2) + ':' : ''}${(
				'0' + minutes
			).slice(-2)}:${('0' + seconds).slice(-2)}`;
		}

		function daysAgo(time) {
			const today = new Date();
			const createdOn = new Date(time);
			const msInDay = 24 * 60 * 60 * 1000;

			createdOn.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diff = (+today - +createdOn) / msInDay;

			return diff;
		}

		const embed = new EmbedBuilder()
			.setTitle(
				`**${member.username}${
					member.discriminator && member.discriminator !== '0'
						? `#${member.discriminator}`
						: ''
				}**`,
			)
			.setColor(0x36393e)
			.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048 }))
			.setDescription(`UID: ${member.id}`)
			.addFields([
				{
					name: '**SYSTEM USER:**',
					value: stripIndents`
                    ${member.system ? 'Yes' : 'No'}
                    `,
					inline: true,
				},
				{
					name: '**USERNAME:**',
					value: stripIndents`
                    ${member.nickname ? member.nickname : 'No'}
                    `,
					inline: true,
				},
				{
					name: '**PARTIAL:**',
					value: stripIndents`
                    ${member.partial ? 'Yes' : 'No'}
                    `,
					inline: true,
				},
				{
					name: '**HIGHEST ROLE:**',
					value: stripIndents`
                    member.roles.highest.toString()
                    `,
					inline: true,
				},
				{
					name: '**BADGES:**',
					value: stripIndents`
                    ${TARGET_BADGES.length > 0 ? TARGET_BADGES.join(' ') : 'No'}
                    `,
					inline: true,
				},
				{
					name: '**TYPE:**',
					value: stripIndents`
                    ${member.bot ? 'Bot' : 'Human'}
                    `,
					inline: true,
				}]);

		 const TARGET_PRESENCE_LAST =
      member.presence.activities.length > 1 ? '\n**――――――――**\n' : '\n';

		if (member.presence != undefined && member.presence.activities.length > 0) {
			embed.addFields([
				{
					name: '**PRESENCE:**',
					value: stripIndents`
                    ${member.presence.activities.map((activity) => {
		return (
			(
				(activity.emoji != undefined &&
                          activity.emoji !== 'null'
					? activity.emoji.id != undefined
						? `<${
							activity.emoji.animated === true ? 'a' : ''
						}:${activity.emoji.name}:${activity.emoji.id}>`
						: `${activity.emoji.name}`
					: '') +
                          (activity.type != undefined &&
                          activity.type !== 'null'
                          	? activity.type === 'CUSTOM_STATUS'
                          		? ''
                          		: activity.type.toString()
                          	: '') +
                          (activity.name != undefined &&
                          activity.name !== 'null'
                          	? activity.name === 'Custom Status'
                          		? activity.state != undefined &&
                                activity.state !== 'null'
                          			? ' **' + activity.state + '**'
                          			: ''
                          		: ' **' + activity.name + '**'
                          	: '') +
                          '\n' +
                          (activity.details != undefined &&
                          activity.details !== 'null'
                          	? activity.details
                          	: '') +
                          '\n' +
                          (activity.details != undefined &&
                          activity.details !== 'null'
                          	? activity.state != undefined &&
                              activity.state !== 'null'
                          		? activity.state
                          		: ''
                          	: '') +
                          '\n' +
                          (activity.timestamps != undefined &&
                          activity.timestamps !== 'null'
                          	? formatDate(
                          		new Date(activity.timestamps.start).getTime(),
                          	) + ' elapsed'
                          	: '') +
                          '\n'
			).replace(/(^n\s+|\s+$)/g, '') +
                        (member.presence.activities[
                        	member.presence.activities.length - 1
                        ] == activity
                        	? ''
                        	: TARGET_PRESENCE_LAST)
		);
	})}
                    `,
					inline: true,
				},
				{
					name: '**CREATED ON:**',
					value: stripIndents`
                    <t:${Math.floor(_createdAt / 1000) + 3600}:F>
					${daysAgo(member.createdAt).toFixed(0)} (days ago)}
                    `,
					inline: true,
				},
				{
					name: '**JOINED ON:**',
					value: stripIndents`
                    <t:${Math.floor(_joinedAt / 1000) + 3600}:F>
					${daysAgo(member.joinedAt).toFixed(0)} (days ago)}
                    `,
					inline: true,
				},
			]); */

		await interaction.reply({ content: `hello, ${member.username}, your a ${member.bot ? 'bot' : 'human'} ` });
	}
};
