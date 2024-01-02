const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const fishJson = require('../../assets/json/fish.json');
const { stripIndent } = require('common-tags');
const ms = require('ms');

const { SlashCommandBuilder } = require('discord.js');

function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = class Fish extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('fish')
				.setDescription('Play at fishing minigame to warn XP and coins')
				.setDMPermission(false),
			usage: 'fish',
			category: 'Economy',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the fish minigame when the user interacts with the command.
 *
 * @param {Client} client - The Discord client instance.
 * @param {Interaction} interaction - The interaction object representing the user's interaction with the command.
 * @return {Promise<void>} - Returns a promise that resolves once the function is complete.
 */
	async run(client, interaction) {
		// Retrieve user data from the database

		const { user } = await db.getUserById(interaction.user.id);

		// Generate a random fish ID
		const fishID = Math.floor(Math.random() * 10) + 1;

		// Determine the rarity of the fish based on the fish ID
		let rarity;
		if (fishID < 5) rarity = 'junk';
		else if (fishID < 8) rarity = 'common';
		else if (fishID < 9) rarity = 'uncommon';
		else if (fishID < 10) rarity = 'rare';
		else rarity = 'legendary';

		// Get the fish data based on its rarity
		const fish = fishJson[rarity];

		// Generate a random worth for the fish within its min and max values
		const worth = randomRange(fish.min, fish.max);

		// Check if the user has a fish cooldown
		if (user.fish_cooldown !== null && 600000 - (Date.now() - user.fish_cooldown) > 0) {
			// Calculate the remaining time until the fish cooldown is over
			const time = ms(600000 - (Date.now() - user.fish_cooldown), {
				long: true,
			});

			// Reply to the interaction with the remaining cooldown time
			interaction.reply(`You've already fished recently, \`${time}\` remaining.`);
		}
		else {
			// Generate a random XP value for the fish
			const xp = Math.floor(Math.random() * 10) + 1;

			// Reply to the interaction with the fish minigame details
			interaction.reply(stripIndent `
      [ :: **FISH MINIGAME** :: ]
      ----------------------------
      Fisherman:  
        ${interaction.user.username}
      Caught:
        ${fish.symbol}
      Coins earned:
        ${worth} ${client.emoji.balance}
      XP earned:
        ${xp} ${client.emoji.star}
      ----------------------------
      [ :: **FISH MINIGAME** :: ]
    `);

			// Update the user's balance, XP, and fish cooldown in the database
			await db.updateUserById(interaction.user.id, {
				balance: user.balance + worth,
				xp: user.xp + xp,
				fish_cooldown: Date.now(),
			});
		}
	}
};