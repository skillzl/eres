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
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		const result = await serverModel.findOne({ serverId: id });

		return result;
	}

	static async getPrefix(id) {
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		const result = await serverModel.findOne({ serverId: id });

		return result.prefix;
	}

	static async updateServerPrefix(id, prefix) {
		if (typeof id !== 'string' || id.length !== 24) {
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
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		const user = new userModel({
			userId: id,
		});

		await user.save();
		return user;
	}

	static async getUserById(id) {
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		let user = await userModel.findOne({ userId: id });
		if (!user) { user = await this.createUser(id); }
		return { user };
	}

	static async updateUserById(id, data) {
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		if (typeof data !== 'object') { throw Error('\'data\' must be an object'); }
		const user = await this.getUserById(id);
		if (!user) { await this.addUser(id); }

		await userModel.findOneAndUpdate({ userId: id }, data);
	}

	static async removeUser(id) {
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		await userModel.findOneAndDelete({ userId: id });
	}

	static async updateServerById(id, settings) {
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		if (typeof settings !== 'object') { throw Error('\'settings\' must be an object'); }

		const guild = await this.findServer(id);

		if (!guild) { await this.createServer(id); }

		await serverModel.findOneAndUpdate({ guildId: id }, settings);
	}

	static async removeServer(id) {
		if (typeof id !== 'string' || id.length !== 24) {
			throw new Error('Invalid ID');
		}
		await serverModel.findOneAndDelete({ guildId: id });
	}
};