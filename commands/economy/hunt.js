const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const huntJson = require('../../assets/json/hunt.json');
const { stripIndent } = require('common-tags');
const ms = require('ms');

const { SlashCommandBuilder } = require('discord.js');

/**
 * Generates a random number within a specified range.
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @return {number} A random number within the specified range.
 */
function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = class Hunt extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('hunt')
				.setDescription('Play at hunting minigame to warn XP and coins')
				.setDMPermission(false),
			usage: 'hunt',
			category: 'Economy',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the function with the given client and interaction.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} A promise that resolves when the function is finished.
 */
	async run(client, interaction) {
		// Get user information from the database
		const { user } = await db.getUserById(interaction.user.id);

		// Generate a random hunt ID to determine rarity
		let rarity;
		const huntID = Math.floor(Math.random() * 10) + 1;
		if (huntID < 5) rarity = 'junk';
		else if (huntID < 8) rarity = 'common';
		else if (huntID < 9) rarity = 'uncommon';
		else if (huntID < 10) rarity = 'rare';
		else rarity = 'legendary';

		// Get animal information based on rarity
		const animal = huntJson[rarity];

		// Generate a random worth within the animal's min and max range
		const worth = randomRange(animal.min, animal.max);

		// Check if the user has a cooldown for hunting
		if (user.hunt_cooldown !== null && 600000 - (Date.now() - user.hunt_cooldown) > 0) {
			// Calculate the remaining cooldown time
			const time = ms(600000 - (Date.now() - user.hunt_cooldown), { long: true });

			// Reply with the remaining cooldown time
			interaction.reply(`You've already hunted recently, \`${time}\` remaining.`);
		}
		else {
			// Generate a random amount of xp
			const xp = Math.floor(Math.random() * 10) + 1;

			// Reply with the hunt results
			interaction.reply(stripIndent`
      [ :: **HUNT MINIGAME** :: ]
      ----------------------------
      Hunter:  
        ${interaction.user.username}
      Killed:
        ${animal.symbol}
      Coins earned:
        ${worth} ${client.emoji.balance}
      XP earned:
        ${xp} ${client.emoji.star}
      ----------------------------
      [ :: **HUNT MINIGAME** :: ]
    `);

			// Update the user's balance, xp, and hunt cooldown in the database
			await db.updateUserById(interaction.user.id, {
				balance: user.balance + worth,
				xp: user.xp + xp,
				hunt_cooldown: Date.now(),
			});
		}
	}
};