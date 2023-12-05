const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const packages = require('../../package.json');
const mongoose = require('mongoose');

const dayjs = require('dayjs');
const db = require('../../database/manager');

module.exports = class Analytics extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('analytics')
				.setDescription('Display client\'s analytics')
				.setDMPermission(false),
			usage: 'analytics',
			category: 'Developer',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		if (interaction.user.id !== process.env.DEVELOPER_ID) return interaction.reply('Missing `DEVELOPER` permission.');
		if (!process.env.ANALYTICS_ID) return interaction.reply('<:red_emoji:1126936340022435963> Analytics unique identifier not set.');

		try {
			const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);

			const embed = new EmbedBuilder()
				.setAuthor({ name: `${packages.name}@${packages.version}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }) })
				.setColor(0x36393e)
				.setDescription(`Analytics ${client.user.username.toLowerCase()}.fun`)
				.addFields(
					{ name: '7 Days Ago', value: `Guilds: ${data.guilds || 0}\nUsers: ${data.users || 0}`, inline: true },
					{ name: 'Now', value: `Guilds: ${client.guilds.cache.size || 0}\nUsers: ${client.users.cache.size || 0}`, inline: true },
					{ name: 'Others', value: `Commands Used: ${data.commands_used + 1 || 0}\nReports: ${data.reports || 0}`, inline: true },
					{ name: 'Client', value: `\`\`\`js\nLicense :: ${packages.license}\nVersion :: ${packages.version}\nUptime :: ${dayjs(client.uptime).format('D [d], H [h], m [m], s [s]')}\nReady :: ${client.uptime ? 'True' : 'False'}\`\`\`` },
				)
				.setFooter({
					text: 'Cron scheduler work: \'0 0 * * 0\' (every 7 days).',
				})
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			if (err instanceof mongoose.Error.CastError) {
				console.error(`[Database]: Invalid 🔴 ObjectId: ${err.value} (Analytics _id in .env file)`);
				interaction.reply('<:red_emoji:1126936340022435963> Analytics unique identifier not set.');
			}
			else {
				console.error(err);
			}
		}
	}
};