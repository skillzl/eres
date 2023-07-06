const Command = require('../../structures/CommandClass');

const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = class Avatar extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('avatar')
				.setDescription('Fetches the avatar of a user.')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'avatar',
			category: 'Info',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const user = interaction.options.getUser('target') || interaction.user;


		const buttonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('download')
					.setStyle(ButtonStyle.Link)
					.setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' })}`),
			);

		const embed = new EmbedBuilder()
			.setTitle(user.username)
			.setColor(0x36393e)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }));

		await interaction.reply({ embeds: [embed], components: [buttonRow] });
	}
};