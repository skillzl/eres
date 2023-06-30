const Command = require('../../structures/CommandClass');

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = class Avatar extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('avatar')
				.setDescription('Fetches the avatar of a user.')
				.setDMPermission(false),
			usage: 'avatar',
			category: 'Info',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const user = client.users.cache.get(interaction.targetId) || interaction.user;

		const embed = new EmbedBuilder()
			.setTitle(`**${user.username}'s Avatar**`)
			.setColor(0x36393e)
			.setImage(user.displayAvatarURL({ size: 2048 }));

		await interaction.reply({ embeds: [embed] });
	}
};