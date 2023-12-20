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
	async run() {
		const client = this.client;

		mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).then(() => console.log('[Database]: Connected to 🥬 mongoose database server.'));

		const webPortal = require('../../server');
		webPortal.load(client);

		cron.schedule('0 0 * * 0', async () => {
			const guilds = client.guilds.cache.size;
			const users = client.users.cache.size;

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

		cron.schedule('*/5 * * * *', async () => {
			client.user.setActivity('🌴 ' + client.users.cache.size.toLocaleString() + ' users', { type: ActivityType.Watching });
		});

		client.user.setActivity('🌴 ' + client.users.cache.size.toLocaleString() + ' users', { type: ActivityType.Watching });

		console.log(`[Deploy]: 🟢 ${client.user.tag} is online. `);
		console.log(`[Info]: Interacted with ${client.users.cache.size.toLocaleString()} users 👥 and ${client.guilds.cache.size.toLocaleString()} guilds 🈂️.`);
	}
};