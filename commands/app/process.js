const Command = require('../../structures/CommandClass');

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
		const btn_one = new ButtonBuilder()
			.setURL(process.env.CALLBACK_URL)
			.setLabel('website')
			.setStyle(ButtonStyle.Link);

		const btn_two = new ButtonBuilder()
			.setURL('https://github.com/skillzl/eres')
			.setLabel('github')
			.setStyle(ButtonStyle.Link);

		const row = new ActionRowBuilder().addComponents(
			btn_one,
			btn_two,
		);

		const embed = new EmbedBuilder()
			.setAuthor({ name: `${packages.name}@${packages.version}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }) })
			.setColor(0x36393e)
			.setDescription('Live process values, also seen on our website.')
			.addFields(
				{ name: 'Process', value: `Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}mb\nCPU:${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%\nPing: ${client.ws.ping || 0}ms\nUptime: ${dayjs(client.uptime).format('D [d], H [h], m [m], s [s]')}`, inline: true },
				{ name: 'Packages', value: `discord.js: ^${version}\nexpress: ${packages.dependencies['express']}\nmongoose: ${packages.dependencies['mongoose']}\nnode.js: ^${process.version}`, inline: true },
				{ name: 'Cache', value: `Guilds: ${client.guilds.cache.size || 0}\nChannels: ${client.channels.cache.size || 0}\nEmojis: ${client.emojis.cache.size || 0 }\nUsers: ${client.users.cache.size || 0}`, inline: true },
			)
			.setFooter({
				text: 'You are experiencing a beta version of this application that may suffer some unfinished features!',
			})
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

		await interaction.reply({ embeds: [embed], components: [row] });

	}
};