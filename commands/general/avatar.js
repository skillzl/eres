const Command = require('../../structures/CommandClass');

const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = class Avatar extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('avatar')
				.setDescription('Fetches the avatar of a user')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'avatar [user]',
			category: 'General',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Run the function.
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction received.
 */
	async run(client, interaction) {
		// Get the target user from the interaction options, or use the interaction user as the default
		const user = interaction.options.getUser('target') || interaction.user;

		// Create the button row with four buttons
		const buttonRow = new ActionRowBuilder()
			.addComponents(
				// Button to display user avatar as a PNG image
				new ButtonBuilder()
					.setLabel('png')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' })}`),

				// Button to display user avatar as a JPG image
				new ButtonBuilder()
					.setLabel('jpg')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'jpg' })}`),

				// Button to display user avatar as a JPEG image
				new ButtonBuilder()
					.setLabel('jpeg')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'jpeg' })}`),

				// Button to display user avatar as a WebP image
				new ButtonBuilder()
					.setLabel('webp')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'webp' })}`),
			);

		// Create the embed with user information and avatar as a PNG image
		const embed = new EmbedBuilder()
			.setTitle(user.username)
			.setColor(0x2B2D31)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }));

		// Send the embed and button row as a reply to the interaction
		await interaction.reply({ embeds: [embed], components: [buttonRow] });
	}
};