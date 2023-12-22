const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

const fs = require('fs');
const { createTranscript } = require('discord-html-transcripts');

module.exports = class TranscriptCommand extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('transcript')
				.setDescription('Generates a transcript of the last 100 messages in the channel')
				.setDMPermission(true),
			usage: 'transcript',
			category: 'Utils',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links', 'Manage Messages'],
		});
	}

	async run(client, interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply('You are missing `MANAGE_MESSAGES` permission.');

		interaction.deferReply({ fetchReply: true });
		interaction.channel.messages.fetch({ limit: 100 });

		try {
			const transcript = await createTranscript(interaction.channel, {
				returnType: 'string',
				limit: 100,
			});

			fs.writeFile(`./public/transcripts/${interaction.channel.id}-transcript.html`, transcript, err => {
				if (err) {
					console.error(err);
					return;
				}
				interaction.editReply({
					content: `<:mail_emoji:1170364505616826398> Here's the transcript of the last \`100 messages\` in this channel: ${interaction.channel}\nhttp://${process.env.DOMAIN}/transcripts/${interaction.channel.id}-transcript.html`,
				});
			});
		}
		catch (err) {
			console.error(err);
		}
	}
};
