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
	/**
 * Executes the run function.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - Returns nothing.
 */
	async run(client, interaction) {
		// Check if the user has the DEVELOPER permission
		if (interaction.user.id !== process.env.DEVELOPER_ID) {
			return interaction.reply(`${client.emoji.red_emoji} Missing \`DEVELOPER\` permission.`);
		}

		// Check if the ANALYTICS_ID is set
		if (!process.env.ANALYTICS_ID) {
			return interaction.reply(`${client.emoji.red_emoji} Analytics unique identifier not set.`);
		}

		try {
			// Retrieve analytics data by ID
			const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);

			// Calculate the total number of users in all guilds
			const users = client.guilds.cache.reduce(
				(a, g) => a + g.memberCount,
				0,
			);

			// Start measuring CPU usage
			const startUsage = process.cpuUsage();

			// Delay for 500 milliseconds
			const now = Date.now();
			while (Date.now() - now < 500);

			// Calculate CPU usage
			const endUsage = process.cpuUsage(startUsage);
			const userCPU = endUsage.user / 1000000;
			const systemCPU = endUsage.system / 1000000;

			const totalCPU = userCPU + systemCPU;
			const cpuPercent = (totalCPU / 0.5) * 100;

			// Build the embed for the analytics
			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${packages.name}@${packages.version}`,
					iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }),
				})
				.setColor(0x2B2D31)
				.setDescription(`Analytics ${process.env.DOMAIN}`)
				.addFields(
					{ name: '7 Days Ago', value: `Guilds: ${data.guilds || 0}\nUsers: ${data.users || 0}`, inline: true },
					{ name: 'Now', value: `Guilds: ${client.guilds.cache.size || 0}\nUsers: ${users || 0}`, inline: true },
					{ name: 'Others', value: `Commands Used: ${data.commands_used + 1 || 0}\nReports: ${data.reports || 0}`, inline: true },
					{
						name: 'Client',
						value: `\`\`\`js\nLicense :: ${packages.license}\nEmoji ::  ${client.emojis.cache.size || 0 }\nChannels :: ${client.channels.cache.size || 0}\nProcess Usage :: ${cpuPercent.toFixed(2)}%\nPing :: ${client.ws.ping || 0}ms\nMemory :: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}mb\nUptime :: ${dayjs(client.uptime).format('D [d], H [h], m [m], s [s]')}\nReady :: ${client.uptime ? 'True' : 'False'}\`\`\``,
					},
				)
				.setFooter({
					text: 'Cron scheduler work: \'0 0 * * 0\' (every 7 days).',
				})
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }));

			// Send the embed as a reply to the interaction
			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			if (err instanceof mongoose.Error.CastError) {
				console.error(`[Database]: Invalid 🔴 ObjectId: ${err.value} (Analytics _id in .env file)`);
				interaction.reply(`${client.emoji.red_emoji} Analytics unique identifier not set.`);
			}
			else {
				console.error(err);
			}
		}
	}
};