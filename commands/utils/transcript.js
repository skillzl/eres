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

	/**
 * Runs the function asynchronously.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - A promise that resolves when the function completes.
 */
	async run(client, interaction) {
	// Check if the user has the "MANAGE_MESSAGES" permission
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
		// Reply with an error message if the user doesn't have the permission
			return await interaction.reply(`${client.emoji.red_emoji} You are missing \`MANAGE_MESSAGES\` permission.`);
		}

		// Defer the reply to the interaction to prevent timeouts
		interaction.deferReply({ fetchReply: true });

		// Fetch the last 100 messages in the channel
		interaction.channel.messages.fetch({ limit: 100 });

		try {
		// Create a transcript of the channel's messages
			const transcript = await createTranscript(interaction.channel, {
				returnType: 'string',
				limit: 100,
			});

			// Write the transcript to a file
			fs.writeFile(`./public/transcripts/${interaction.channel.id}-transcript.html`, transcript, err => {
				if (err) {
					console.error(err);
					return;
				}
				// Edit the interaction's reply with a message containing the transcript URL
				interaction.editReply({
					content: `${client.emoji.mail} Here's the transcript of the last \`100 messages\` in this channel: ${interaction.channel}\nhttp://${process.env.DOMAIN}/transcripts/${interaction.channel.id}-transcript.html`,
				});
			});
		}
		catch (err) {
			console.error(err);
		}
	}
};
