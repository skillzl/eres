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

	/**
 * Update the user's XP, calculate their level, and send a level up message if applicable.
 * @param {Message} message - The message object.
 */
	async run(message) {
		// Check if the message author is not a bot
		if (!message.author.bot) {
			// Get the user from the database
			const { user } = await db.getUserById(message.author.id);

			// Generate a random XP value between 1 and 5
			const xp = Math.ceil(Math.random() * (1 * 5));

			// Function to calculate the user's level based on their XP
			const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

			// Calculate the user's current level
			const level = calculateUserXp(user.xp);

			// Calculate the user's new level if they gain the XP
			const newLevel = calculateUserXp(user.xp + xp);

			// Check if the user leveled up
			if (newLevel > level) {
				// Send a level up message and delete it after 10 seconds
				const msg = await message.reply(`<:star_emoji:1126279940321574913> Congratulations, you leveled up to level \`${newLevel}\`!`);
				setTimeout(() => {
					msg?.delete();
				}, 10000);
			}

			// Update the user's XP in the database
			await db.updateUserById(message.author.id, {
				xp: user.xp + xp,
			});
		}
	}
};