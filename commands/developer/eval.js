const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Eval extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('eval')
				.setDescription('Evaluates javascript code')
				.addStringOption(option =>
					option.setName('input')
						.setDescription('Your code')
						.setRequired(true))
				.setDMPermission(false),
			usage: 'eval [string]',
			category: 'Developer',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	async run(client, interaction) {
		if (interaction.user.id !== process.env.DEVELOPER_ID) return interaction.reply(`${client.emoji.red_emoji} Missing \`DEVELOPER\` permission.`);

		const toEval = interaction.options.getString('input');
		const toRemove = /^(```js)|(```)$/gi;

		const embed = new EmbedBuilder();
		try {
			const evalled = eval(toEval.replace(toRemove, ''));
			embed.setTitle('Evaluation Successful');
			embed.addFields({ name: 'Output', value: '```js\n' + evalled + '\n```' });
			embed.setColor(0x2B2D31);
		}
		catch (err) {
			embed.setTitle('Evaluation Failed');
			embed.addFields({ name: 'Output', value: '```js\n' + err + '\n```' });
			embed.setColor(0x2B2D31);
		}

		interaction.reply({ embeds: [embed] });
	}
};