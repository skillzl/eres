const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Server extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('server')
				.setDescription('Guild informations and statistics')
				.setDMPermission(true),
			usage: 'server',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		function daysAgo(time) {
			const today = new Date();
			const createdOn = new Date(time);
			const msInDay = 24 * 60 * 60 * 1000;

			createdOn.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diff = (+today - +createdOn) / msInDay;

			return diff;
		}

		const _createdAt = new Date(interaction.guild.createdAt);

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

		const guildRoles = interaction.guild.roles.cache
			.map((role) => role.toString())
			.join(' ')
			.substring(0, 1024)
			.replace(/\s\S+[^>]$/, '');

		const members = {
			online: interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size,
			dnd: interaction.guild.members.cache.filter(member => member.presence?.status === 'dnd').size,
			idle: interaction.guild.members.cache.filter(member => member.presence?.status === 'idle').size,
			bots: interaction.guild.members.cache.filter(member => member.user.bot).size,
		};

		const owner = await interaction.guild.fetchOwner();

		const embed = new EmbedBuilder()
			.setColor(0x36393e)
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
				{ name: 'OWNERSHIP', value: `<:owner_emoji:1139506434707574874> ${owner}`, inline: true },
				{ name: 'PARTNERED', value: `${interaction.guild.partnered ? '<:partner_emoji:1139514892320251905>' : '<:red_emoji:1126936340022435963>'}`, inline: true },
				{ name: 'CUSTOM URL', value: `${interaction.guild.vanityURLCode ?? '<:red_emoji:1126936340022435963>'}`, inline: true },
				{ name: 'VERIFIED', value: `${interaction.guild.verified ? '<:verify_emoji:1139514506884681850>' : '<:red_emoji:1126936340022435963>'}`, inline: true },
				{ name: 'BOOSTS', value: interaction.guild.premiumSubscriptionCount + ` (Level: ${interaction.guild.premiumTier})`, inline: true },
				{ name: 'AFK CHANNEL', value: interaction.guild.afkChannel ? `<:moon_emoji:1139513847238119425> ${interaction.guild.afkChannel.name}` : '<:red_emoji:1126936340022435963>', inline: true },
				{ name: 'CREATED ON', value: `<t:${Math.floor(_createdAt / 1000) + 3600}:F>` + `\n${daysAgo(interaction.guild.createdAt).toFixed(0)} (days ago)` },
				{ name: `MEMBERS (${interaction.guild.memberCount})`, value: `online (${members.online}) : dnd (${members.dnd})  idle (${members.idle}) : bots (${members.bots})`, inline: true },
				{ name: `EMOJIS (${interaction.guild.emojis.cache.size})`, value: `${guildEmojis}`, inline: true },
				{ name: `ROLES (${interaction.guild.roles.cache.size})`, value: `${guildRoles}`, inline: true },
			);

		const inviteBanner = interaction.guild.bannerURL({
			size: 2048,
			format: 'png',
		});

		if (inviteBanner !== null) {
			embed.setImage(inviteBanner);
		}

		await interaction.reply({ embeds: [embed] });
	}
};