const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const dayjs = require('dayjs');
const packages = require('../../package.json');

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, version } = require('discord.js');

module.exports = class Process extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('process')
				.setDescription('Application status (also online on website)')
				.setDMPermission(false),
			usage: 'process',
			category: 'App',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const buttonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setURL('https://github.com/skillzl/eres')
					.setLabel('GitHub')
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setURL(`https://${process.env.DOMAIN}/stats`)
					.setLabel('Website')
					.setStyle(ButtonStyle.Link),
			);

		const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);

		const users = client.guilds.cache.reduce(
			(a, g) => a + g.memberCount,
			0,
		);

		const startUsage = process.cpuUsage();

		const now = Date.now();
		while (Date.now() - now < 500);

		const endUsage = process.cpuUsage(startUsage);
		const userCPU = endUsage.user / 1000000;
		const systemCPU = endUsage.system / 1000000;

		const totalCPU = userCPU + systemCPU;
		const cpuPercent = (totalCPU / 0.5) * 100;

		const embed = new EmbedBuilder()
			.setAuthor({ name: `${packages.name}@${packages.version}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }) })
			.setColor(0x2B2D31)
			.setDescription('Live process values, also seen on our website.')
			.addFields(
				{ name: 'Process', value: `Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}mb\nProcess Usage: ${cpuPercent.toFixed(2)}%\nPing: ${client.ws.ping || 0}ms\nUptime: ${dayjs(client.uptime).format('D [d], H [h], m [m], s [s]')}`, inline: true },
				{ name: 'Packages', value: `discord.js: ^${version}\nexpress: ${packages.dependencies['express']}\nmongoose: ${packages.dependencies['mongoose']}\nnode.js: ^${process.version}`, inline: true },
				{ name: 'Cache', value: `Guilds: ${client.guilds.cache.size || 0}\nChannels: ${client.channels.cache.size || 0}\nEmojis: ${client.emojis.cache.size || 0 }\nUsers: ${users || 0}`, inline: true },
			)
			.setFooter({
				text: `In total used: ${data.commands_used + 1 || 0} slash commands and played ${data.songs_played} songs.`,
			})
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

		await interaction.reply({ embeds: [embed], components: [buttonRow] });

	}
};