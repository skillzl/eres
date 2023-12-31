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
	async run(client, interaction) {
		const { user } = await db.getUserById(interaction.user.id);

		let rarity;
		const fishID = Math.floor(Math.random() * 10) + 1;
		if (fishID < 5) rarity = 'junk';
		else if (fishID < 8) rarity = 'common';
		else if (fishID < 9) rarity = 'uncommon';
		else if (fishID < 10) rarity = 'rare';
		else rarity = 'legendary';

		const fish = fishJson[rarity];
		const worth = randomRange(fish.min, fish.max);

		if (user.fish_cooldown !== null && 600000 - (Date.now() - user.fish_cooldown) > 0) {
			const time = ms(600000 - (Date.now() - user.fish_cooldown), {
				long: true,
			});

			interaction.reply(`You've already fished recently, \`${time}\` remaining.`);
		}
		else {
			const xp = Math.floor(Math.random() * 10) + 1;

			interaction.reply(stripIndent `
[ :: **FISH MINIGAME** :: ]
----------------------------
Fisherman:  
\u3000 ${interaction.user.username}
Caught:
\u3000 ${fish.symbol}
Coins earned:
\u3000 ${worth} <:balance_emoji:1129875960188112966>
XP earned:
\u3000 ${xp} <:star_emoji:1126279940321574913>
----------------------------
[ :: **FISH MINIGAME** :: ]
`);

			await db.updateUserById(interaction.user.id, {
				balance: user.balance + worth,
				xp: user.xp + xp,
				fish_cooldown: Date.now(),
			});
		}
	}
};