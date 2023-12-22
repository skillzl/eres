/* eslint-disable no-shadow */
const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class MessageCreate extends Event {
	constructor(client) {
		super(client, {
			name: 'messageCreate',
			category: 'message',
		});
	}

	async run(message) {
		if (!message.author.bot) {
			const { user } = await db.getUserById(message.author.id);
			const xp = Math.ceil(Math.random() * (1 * 5));

			const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

			const level = calculateUserXp(user.xp);
			const newLevel = calculateUserXp(user.xp + xp);

			if (newLevel > level) {
				const msg = await message.reply(`<:star_emoji:1126279940321574913> Congratulations, you leveled up to level \`${newLevel}\`!`);
				setTimeout(() => {
					msg?.delete();
				}, 10000);
			}

			await db.updateUserById(message.author.id, {
				xp: user.xp + xp,
			});
		}
	}
};