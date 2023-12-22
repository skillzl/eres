const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Plugins extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('plugins')
				.setDescription('Discover application\'s plugins')
				.setDMPermission(false),
			usage: 'plugins',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const embed = new EmbedBuilder()
			.setColor(0x36393e)
			.setTitle('<:moon_emoji:1139513847238119425> Plugins')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 128, format: 'png' }))
			.setDescription('Hey there!\nGlad to have you here. Let me guess. Plugins!\nWell you have some, autorole and the good old welcome message and leave message.')
			.addFields(
				{ name: 'Autorole', value: 'The basic autorole for your newcomers, just add one and see the magic.', inline: true },
				{ name: 'Welcome Message', value: 'Classic welcome message, but this time it\'s a minimalistic image, with good taste, tho!', inline: true },
				{ name: 'Leave Message', value: 'And also, why not, the leave message, you can either set both in a channel or make it your way.\nBe different!', inline: true },
			)
			.setFooter({
				text: 'New here! You should check out our website to set-up these plugins.',
			});

		await interaction.reply({ embeds: [embed] });
	}
};