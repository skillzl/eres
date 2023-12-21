const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { createTranscript } = require('discord-html-transcripts'); // Assuming you have it installed

module.exports = class TranscriptCommand extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription('Generates a transcript of the last 100 messages in the channel')
        .setDMPermission(false),
      usage: 'transcript',
      category: 'Chat Utilities',
      permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
    });
  }

  async run(client, interaction) {
    const channel = interaction.channel;

    try {
      interaction.deferReply({ fetchReply: true }); // Show a loading message

      const messages = await channel.messages.fetch({ limit: 100 });
      const transcriptFile = await createTranscript(channel, {
        limit: 100,
        returnBuffer: false,
        fileName: `${channel.name.toLowerCase()}-transcript.html`,
      });

      await interaction.editReply({
        content: `Here's the transcript of the last 100 messages in this channel: ${transcriptFile.url}`,
        files: [transcriptFile],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'Failed to create transcript.' + error});
    }
  }
};
