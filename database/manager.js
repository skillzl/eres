const serverModel = require('./serverModel');
const userModel = require('./userModel');

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
		const result = await serverModel.findOne({ serverId: id });

		return result;
	}

	static async getPrefix(id) {
		const result = await serverModel.findOne({ serverId: id });

		return result.prefix;
	}

	static async updateServerPrefix(id, prefix) {
		const result = await serverModel.findOne({ serverId: id });

		if (result) {
			return await result.updateOne({ prefix });
		}
		else {
			return;
		}
	}

	static async createUser(id) {
		const user = new userModel({
			userId: id,
		});

		await user.save();
		return user;
	}

	static async getUserById(id) {
		let user = await userModel.findOne({ userId: id });
		if (!user) { user = await this.createUser(id); }
		return { user };
	}

	static async updateUserById(id, data) {
		if (typeof data !== 'object') { throw Error('\'data\' must be an object'); }
		const user = await this.getUserById(id);
		if (!user) { await this.addUser(id); }

		await userModel.findOneAndUpdate({ userId: id }, data);
	}

	static async removeUser(id) {
		await userModel.findOneAndDelete({ userId: id });
	}

	static async getGuildById(id) {
		let guild = await serverModel.findOne({ guildId: id });

		if (!guild) { guild = await this.addGuild(id); }
		return guild;
	}

	static async updateGuildById(id, settings) {
		if (typeof settings !== 'object') { throw Error('\'settings\' must be an object'); }

		const guild = await this.getGuildById(id);

		if (!guild) { await this.addGuild(id); }

		await serverModel.findOneAndUpdate({ guildId: id }, settings);
	}

	static async removeGuild(id) {
		await serverModel.findOneAndDelete({ guildId: id });
	}
};