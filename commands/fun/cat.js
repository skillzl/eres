const Command = require('../../structures/CommandClass');

const fetch = require('node-fetch');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Cat extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('cat')
				.setDescription('Sends a random cat image.')
				.setDMPermission(false),
			usage: 'cat',
			category: 'Fun',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		if (!process.env.SKILLZL_API_KEY || process.env.SKILLZL_API_KEY === '') {
			return interaction.reply(`${client.emoji.red_emoji} Missing \`SKILLZL_API_KEY\` in .env file.`);
		}

		const result = await fetch(`https://api.skillzl.dev/cat/?key=${process.env.SKILLZL_API_KEY}`).then((res) => res.json());

		const embed = new EmbedBuilder()
			.setColor(0x2B2D31)
			.setTitle('cat 🐈')
			.setURL(result.url)
			.setImage(result.url)
			.setFooter({
				text: 'api.skillzl.dev',
			});

		await interaction.reply({ embeds: [embed] });
	}
};