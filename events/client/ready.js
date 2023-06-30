const Event = require('../../structures/EventClass');
const mongoose = require('mongoose');

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
		}).then(() => console.log('MongoDB Client has been successfully connected.'));

		const webPortal = require('../../server');
		webPortal.load(client);

		client.user.setActivity('👋 Hello World!', { type: ActivityType.Playing });

		console.log(`Discord Bot is now online with ${client.users.cache.size} users and ${client.guilds.cache.size} servers.`);
	}
};