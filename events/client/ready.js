const Event = require('../../structures/EventClass');
const cron = require('node-cron');
const mongoose = require('mongoose');

const analyticsModel = require('../../database/analyticsModel');
const { ActivityType } = require('discord.js');

module.exports = class ReadyEvent extends Event {
	constructor(client) {
		super(client, {
			name: 'ready',
			once: true,
		});
	}
	/**
 * This function is responsible for running the application.
 * It connects to the database, loads the web portal, and sets up scheduled tasks.
 */
	async run() {
		const client = this.client;

		// Connect to the MongoDB database
		await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('[Database]: Connected to 🥬 mongoose database server.');

		// Load the web portal
		const webPortal = require('../../server');
		webPortal.load(client);

		// Schedule task to update guilds and users analytics stats every Sunday at midnight
		cron.schedule('0 0 * * 0', async () => {
			const guilds = client.guilds.cache.size;
			const users = client.guilds.cache.reduce(
				(a, g) => a + g.memberCount,
				0,
			);

			const analytics = await analyticsModel.findOne({});
			if (analytics) {
				analytics.guilds = guilds;
				analytics.users = users;
				await analytics.save();
			}
			else {
				await analyticsModel.create({ guilds, users });
			}
			console.log('[Scheduler]: 🟢 Updated guilds and users analytics stats.');
		});

		// Schedule task to update user activity every 5 minutes
		cron.schedule('*/5 * * * *', async () => {
			const users = client.guilds.cache.reduce(
				(a, g) => a + g.memberCount,
				0,
			);

			client.user.setActivity('🌴 ' + users.toLocaleString() + ' users', { type: ActivityType.Watching });
		});

		// Update user activity immediately
		const users = client.guilds.cache.reduce(
			(a, g) => a + g.memberCount,
			0,
		);

		client.user.setActivity('🌴 ' + users.toLocaleString() + ' users', { type: ActivityType.Watching });

		console.log(`[Deploy]: 🟢 ${client.user.tag} is online. `);
		console.log(`[Info]: Interacted with ${users.toLocaleString()} users 👥 and ${client.guilds.cache.size.toLocaleString()} guilds 🈂️.`);
	}
};