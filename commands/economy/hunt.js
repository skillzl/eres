const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const huntJson = require('../../assets/json/hunt.json');
const { stripIndent } = require('common-tags');
const ms = require('ms');

const { SlashCommandBuilder } = require('discord.js');

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
	async run(client, interaction) {
		const { user } = await db.getUserById(interaction.user.id);

		let rarity;
		const huntID = Math.floor(Math.random() * 10) + 1;
		if (huntID < 5) rarity = 'junk';
		else if (huntID < 8) rarity = 'common';
		else if (huntID < 9) rarity = 'uncommon';
		else if (huntID < 10) rarity = 'rare';
		else rarity = 'legendary';

		const animal = huntJson[rarity];
		const worth = randomRange(animal.min, animal.max);

		if (user.hunt_cooldown !== null && 600000 - (Date.now() - user.hunt_cooldown) > 0) {
			const time = ms(600000 - (Date.now() - user.hunt_cooldown), {
				long: true,
			});

			interaction.reply(`You've already hunted recently, \`${time}\` remaining.`);
		}
		else {
			const xp = Math.floor(Math.random() * 10) + 1;

			interaction.reply(stripIndent `
[ :: **HUNT MINIGAME** :: ]
----------------------------
Hunter:  
\u3000 ${interaction.user.username}
Killed:
\u3000 ${animal.symbol}
Coins earned:
\u3000 ${worth} <:balance_emoji:1129875960188112966>
XP earned:
\u3000 ${xp} <:star_emoji:1126279940321574913>
----------------------------
[ :: **HUNT MINIGAME** :: ]
`);

			await db.updateUserById(interaction.user.id, {
				balance: user.balance + worth,
				xp: user.xp + xp,
				hunt_cooldown: Date.now(),
			});
		}
	}
};