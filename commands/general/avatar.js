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
	async run(client, interaction) {
		const user = interaction.options.getUser('target') || interaction.user;

		const buttonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('png')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' })}`),

				new ButtonBuilder()
					.setLabel('jpg')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'jpg' })}`),

				new ButtonBuilder()
					.setLabel('jpeg')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'jpeg' })}`),

				new ButtonBuilder()
					.setLabel('webp')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'webp' })}`),
			);

		const embed = new EmbedBuilder()
			.setTitle(user.username)
			.setColor(0x2B2D31)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }));

		await interaction.reply({ embeds: [embed], components: [buttonRow] });
	}
};