const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Server extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('server')
				.setDescription('Guild informations and statistics')
				.setDMPermission(false),
			usage: 'server',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Run function for handling a specific interaction.
 * @param {Client} client - The Discord client instance.
 * @param {Interaction} interaction - The interaction object.
 */
	async run(client, interaction) {
		/**
		 * Calculates the number of days between a given time and the current date.
		 *
		 * @param {Date} time - The time to calculate the number of days ago from.
		 * @return {number} The number of days between the given time and the current date.
		 */
		function daysAgo(time) {
			const today = new Date();
			const createdOn = new Date(time);
			const msInDay = 24 * 60 * 60 * 1000;

			createdOn.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diff = (+today - +createdOn) / msInDay;

			return diff;
		}

		// Get the guild creation date
		const _createdAt = new Date(interaction.guild.createdAt);

		// Get the guild emojis
		const guildEmojis = interaction.guild.emojis.cache.size ?
			interaction.guild.emojis.cache
				.map(
					(emoji) =>
						`<${emoji.animated == true ? 'a' : ''}:${emoji.name}:${emoji.id}>`,
				)
				.join(' ')
				.substring(0, 1024)
				.replace(/\s\S+[^>]$/, '') :
			'none';

		// Get the guild roles
		const guildRoles = interaction.guild.roles.cache
			.map((role) => role.toString())
			.join(' ')
			.substring(0, 1024)
			.replace(/\s\S+[^>]$/, '');

		// Get the members in the guild with their statuses
		const members = {
			online: interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size,
			dnd: interaction.guild.members.cache.filter(member => member.presence?.status === 'dnd').size,
			idle: interaction.guild.members.cache.filter(member => member.presence?.status === 'idle').size,
			bots: interaction.guild.members.cache.filter(member => member.user.bot).size,
			offline: interaction.guild.memberCount - (interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size + interaction.guild.members.cache.filter(member => member.presence?.status === 'dnd').size + interaction.guild.members.cache.filter(member => member.presence?.status === 'idle').size),
		};
		// Get the guild owner
		const owner = await interaction.guild.fetchOwner();

		// Create an embed with the guild information
		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle(`${interaction.guild.name}`)
			.setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 2048, extension: 'png' }))
			.setDescription(
				`${
					interaction.guild.description != null
						? interaction.guild.description + '\n\n'
						: ''
				}ID: ${interaction.guild.id}`,
			)
			.addFields(
				{ name: 'OWNERSHIP', value: `${client.emoji.crown} ${owner}`, inline: true },
				{ name: 'PARTNERED', value: `${interaction.guild.partnered ? client.emoji.partnered : client.emoji.red_emoji}`, inline: true },
				{ name: 'CUSTOM URL', value: `${interaction.guild.vanityURLCode ?? client.emoji.red_emoji}`, inline: true },
				{ name: 'VERIFIED', value: `${interaction.guild.verified ? client.emoji.verify : client.emoji.red_emoji}`, inline: true },
				{ name: 'BOOSTS', value: interaction.guild.premiumSubscriptionCount + ` (Level: ${interaction.guild.premiumTier})`, inline: true },
				{ name: 'AFK CHANNEL', value: interaction.guild.afkChannel ? `${client.emoji.moon} ${interaction.guild.afkChannel.name}` : client.emoji.red_emoji, inline: true },
				{ name: 'CREATED ON', value: `<t:${Math.floor(_createdAt / 1000) + 3600}:F>` + `\n${daysAgo(interaction.guild.createdAt).toFixed(0)} (days ago)` },
				{ name: `MEMBERS (${interaction.guild.memberCount})`, value: `online (${members.online}) : dnd (${members.dnd})  idle (${members.idle}) : bots (${members.bots}) : offline (${members.offline})`, inline: true },
				{ name: `EMOJIS (${interaction.guild.emojis.cache.size})`, value: `${guildEmojis}`, inline: true },
				{ name: `ROLES (${interaction.guild.roles.cache.size})`, value: `${guildRoles}`, inline: true },
			);

		// Add server banner if it exists and send the embed as a reply to the interaction
		const inviteBanner = interaction.guild.bannerURL({
			size: 2048,
			format: 'png',
		});

		// Add server banner if it exists
		if (inviteBanner !== null) {
			embed.setImage(inviteBanner);
		}

		// Send the embed as a reply to the interaction
		await interaction.reply({ embeds: [embed] });
	}
};