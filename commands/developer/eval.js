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
	/**
 * Runs the function asynchronously.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - Returns a Promise that resolves to nothing.
 */
	async run(client, interaction) {
		// Check if the user is authorized to run the function
		if (interaction.user.id !== process.env.DEVELOPER_ID) {
			// If not authorized, reply with an error message
			return interaction.reply(`${client.emoji.red_emoji} Missing \`DEVELOPER\` permission.`);
		}

		// Get the input from the interaction options
		const toEval = interaction.options.getString('input');
		// Define a regular expression to remove code block delimiters
		const toRemove = /^(```js)|(```)$/gi;

		// Create a new instance of EmbedBuilder
		const embed = new EmbedBuilder();
		try {
			// Evaluate the input using the eval function and remove code block delimiters
			const evalled = eval(toEval.replace(toRemove, ''));
			// Set the title of the embed to indicate successful evaluation
			embed.setTitle('Evaluation Successful');
			// Add the evaluated output to the embed as a field
			embed.addFields({ name: 'Output', value: '```js\n' + evalled + '\n```' });
			// Set the color of the embed
			embed.setColor(0x2B2D31);
		}
		catch (err) {
			// Set the title of the embed to indicate failed evaluation
			embed.setTitle('Evaluation Failed');
			// Add the error message to the embed as a field
			embed.addFields({ name: 'Output', value: '```js\n' + err + '\n```' });
			// Set the color of the embed
			embed.setColor(0x2B2D31);
		}

		// Reply to the interaction with the embed
		interaction.reply({ embeds: [embed] });
	}
};