const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

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
		if (!process.env.ANALYTICS_ID) return interaction.reply({ content: '<:red_emoji:1126936340022435963> Analytics unique identifier not set.' });

		try {
			const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);

			interaction.reply({ content: `# ${client.user.username}'s analytics \n\`\`\`css\nguilds: ${data.guilds} users: ${data.users} commands used: ${data.commands_used + 1}\n\`\`\`` });
		}
		catch (err) {
			if (err instanceof mongoose.Error.CastError) {
				console.error(`[Database]: Invalid 🔴 ObjectId: ${err.value} (Analytics _id in .env file)`);
				interaction.reply({ content: '<:red_emoji:1126936340022435963> Analytics unique identifier not set.' });
			}
			else {
				console.error(err);
			}
		}
	}
};