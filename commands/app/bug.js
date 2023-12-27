const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const ms = require('ms');

const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = class Bug extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('bug')
				.setDescription('Report a bug you\'ve discovered')
				.addStringOption(option =>
					option.setName('string')
						.setDescription('Bug details (e.g. got less xp than it\'s showed I should get)')
						.setRequired(true))
				.setDMPermission(false),
			usage: 'bug [string]',
			category: 'App',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const { user } = await db.getUserById(interaction.user.id);
		const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);

		const timeout = 1800000;
		const string = interaction.options.getString('string');

		if (user.report_cooldown !== null && timeout - (Date.now() - user.report_cooldown) > 0) {
			const time = ms(timeout - (Date.now() - user.report_cooldown), {
				long: true,
			});

			interaction.reply(`You've already used the report command recently, \`${time}\` remaining.`);
		}
		else {
			const webhookClient = new WebhookClient({
				url: `https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`,
			});

			const embed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username} (ID: ${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ extension: 'png', size: 1024 }) })
				.setColor(0x2B2D31)
				.addFields(
					{ name: 'Bug Description', value: `${string}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ extension: 'png', size: 1024 }));

			webhookClient.send({
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL({ extension: 'png', size: 1024 }),
				content: `\`Report: ${data.reports}\``,
				embeds: [embed],
			});

			db.incrementReports();
			db.updateUserById(interaction.user.id, {
				report_cooldown: Date.now(),
			});

			await interaction.reply('Successfully sent the report. Thanks for your feedback!');
		}
	}
};