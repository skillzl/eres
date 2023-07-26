/* eslint-disable no-unused-vars, no-const-assign */
const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const { SlashCommandBuilder } = require('discord.js');

const { stripIndents } = require('common-tags');

const slots = [
	'<:balance_emoji:1129875960188112966>',
	'<:flag_emoji:1129876196549738626>',
	'<:gheart_emoji:1129876399134625902>',
	'<:heart_emoji:1129876126047670403>',
	'<:seven_emoji:1129876077041422356>',
	'<:skull_emoji:1129876004748411041>',
	'<:snowman_emoji:1129876037493334017>',
];

function shuffle(array) {
	const arr = array.slice(0);
	for (let i = arr.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}

module.exports = class Slots extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('slots')
				.setDescription('Try out the slots and make some changes to your account, by winning coins and XP')
				.addStringOption(option =>
					option.setName('input')
						.setDescription('Amount of coins')
						.setRequired(true))
				.setDMPermission(false),
			usage: 'slots',
			category: 'Economy',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const { user } = await db.getUserById(interaction.user.id);

		const amount = interaction.options.getString('input');
		const availableCoins = user.balance;

		if (isNaN(amount)) return interaction.reply('Make sure you enter a valid number.');
		if (!isFinite(amount)) interaction.reply('Make sure you enter a valid number.');
		if (availableCoins < 0) return interaction.reply('Sorry, but you don\'t have that amount of coins.');
		if (amount > availableCoins) return interaction.reply('Sorry, but you don\'t have that amount of coins.');
		if (amount < 100) return interaction.reply('The minimum bet you can play is `100`.');
		if (amount > 100000) { return interaction.reply('The maximum bet you can play is `100,000`.');}

		const random = 5 * amount;
		const xp = Math.floor(Math.random() * 10) + 1;

		const array_one = shuffle(slots);
		const array_two = shuffle(slots);
		const array_tree = shuffle(slots);

		let slotsInteraction = '';
		slotsInteraction = interaction
			.reply(
				stripIndents `
[ :: **SLOTS** :: ]
----------------
${array_one[2]} : ${array_two[0]} : ${array_tree[2]}
            
${array_one[1]} : ${array_two[1]} : ${array_tree[1]} **«**
            
${array_one[0]} : ${array_two[2]} : ${array_tree[0]}
----------------
[ :: **SLOTS** :: ]`,
			)
			.then(async (int) => {
				for (let i = 0; i < 5; i++) {
					array_one.push(array_one.shift());
					array_two.push(array_two.shift());
					array_tree.push(array_tree.shift());

					setTimeout(
						() =>
							int.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${array_one[0]} : ${array_two[1]} : ${array_tree[0]}
              
${array_one[1]} : ${array_two[1]} : ${array_tree[1]} **«**
              
${array_one[0]} : ${array_two[2]} : ${array_tree[0]}
----------------
[ :: **SLOTS** :: ]`),
						800,
					);

					setTimeout(
						() =>
							int.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${array_one[0]} : ${array_two[1]} : ${array_tree[0]}
              
${array_one[1]} : ${array_two[1]} : ${array_tree[1]} **«**
              
${array_one[0]} : ${array_two[2]} : ${array_tree[0]}
----------------
[ :: **SLOTS** :: ]`),
						1300,
					);

					if (
						(array_one[1] === array_two[1] && array_one[1] === array_tree[1]) ||
						(array_one[1] && array_two[1] === array_one[1] && array_tree[1]) ||
						(array_two[1] === array_one[1] && array_two[1] === array_tree[1]) ||
						(array_tree[1] === array_two[1] && array_tree[1] === array_one[1]) ||
						(array_tree[1] && array_two[1] === array_tree[1] && array_one[1]) ||
						(array_one[1] === array_tree[1] && array_tree[1] && array_two[1])
					) {
						await db.updateUserById(interaction.user.id, {
							balance: user.balance + random,
							xp: user.xp + xp,
						});
						return setTimeout(
							() =>
								int.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${array_one[2]} : ${array_two[0]} : ${array_tree[2]}

${array_one[1]} : ${array_two[1]} : ${array_tree[1]} **«**
              
${array_one[0]} : ${array_two[2]} : ${array_tree[0]}
----------------
[ :: **SLOTS** :: ]
${interaction.user.username} won ${random.toLocaleString()} <:balance_emoji:1129875960188112966>. \`(bet: ${amount.toLocaleString()})\`\nXP earned: ${xp} <:star_emoji:1126279940321574913>`),
							2300,
						);
					}

					await db.updateUserById(interaction.user.id, {
						balance: user.balance - amount,
					});
					return setTimeout(
						() =>
							int.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${array_one[2]} : ${array_two[0]} : ${array_tree[2]}
                  
${array_one[1]} : ${array_two[1]} : ${array_tree[1]} **«**
                  
${array_one[0]} : ${array_two[2]} : ${array_tree[0]}
----------------
[ :: **SLOTS** :: ]
${interaction.user.username} lost everything. \`(bet: ${amount.toLocaleString()})\``),
						2300,
					);
				}
			});
	}
};