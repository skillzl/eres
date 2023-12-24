const serverModel = require('./serverModel');
const userModel = require('./userModel');
const analyticsModel = require('./analyticsModel');

module.exports = class Manager {
	static async createServer(id) {
		const result = new serverModel({
			serverId: id,
			prefix: null,
		});

		await result.save();

		return result;
	}

	static async findServer(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const result = await serverModel.findOne({ serverId: id });

		return result;
	}

	static async getPrefix(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const result = await serverModel.findOne({ serverId: id });

		return result.prefix;
	}

	static async updateServerPrefix(id, prefix) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const result = await serverModel.findOne({ serverId: id });

		if (result) {
			return await result.updateOne({ prefix });
		}
		else {
			return;
		}
	}

	static async createUser(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const user = new userModel({
			userId: id,
		});

		await user.save();
		return user;
	}

	static async createAnalytics() {
		const analytics = new analyticsModel({
			commands_used: 0,
			guilds: 0,
			users: 0,
			reports: 0,
		});

		await analytics.save();
		return analytics;
	}

	static async getAnalysticsById(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const data = await analyticsModel.findOne({ _id: id });
		return { data };
	}

	static async incrementReports() {
		const analyticsData = await analyticsModel.findOne();
		if (!analyticsData) { this.createAnalytics(); }

		if (analyticsData) {
			analyticsData.reports += 1;
			await analyticsData.save();
		}
	}

	static async incrementSongsPlayed() {
		const analyticsData = await analyticsModel.findOne();
		if (!analyticsData) { this.createAnalytics(); }

		if (analyticsData) {
			analyticsData.songs_played += 1;
			await analyticsData.save();
		}
	}

	static async incrementCommandsUsed() {
		const analyticsData = await analyticsModel.findOne();
		if (!analyticsData) { this.createAnalytics(); }

		if (analyticsData) {
			analyticsData.commands_used += 1;
			await analyticsData.save();
		}
	}

	static async updateServerAutorole(id, role) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const guild = await this.findServer(id);
		if (!guild) { await this.createServer(id); }

		guild.autorole = role;
		await guild.save();
	}

	static async updateServerWelcome(id, channel) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const guild = await this.findServer(id);
		if (!guild) { await this.createServer(id); }

		guild.welcome = channel;
		await guild.save();
	}

	static async updateServerLeave(id, channel) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		const guild = await this.findServer(id);
		if (!guild) { await this.createServer(id); }

		guild.leave = channel;
		await guild.save();
	}

	static async getUserById(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		let user = await userModel.findOne({ userId: id });
		if (!user) { user = await this.createUser(id); }
		return { user };
	}

	static async updateUserById(id, data) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		if (typeof data !== 'object') { throw Error('\'data\' must be an object'); }
		const user = await this.getUserById(id);
		if (!user) { await this.addUser(id); }

		await userModel.findOneAndUpdate({ userId: id }, data);
	}

	static async removeUser(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		await userModel.findOneAndDelete({ userId: id });
	}

	static async updateServerById(id, settings) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		if (typeof settings !== 'object') { throw Error('\'settings\' must be an object'); }

		const guild = await this.findServer(id);

		if (!guild) { await this.createServer(id); }

		await serverModel.findOneAndUpdate({ guildId: id }, settings);
	}

	static async removeServer(id) {
		if (typeof id !== 'string') {
			throw new Error('Invalid ID');
		}
		await serverModel.findOneAndDelete({ guildId: id });
	}
};