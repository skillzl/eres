const Command = require('../../structures/CommandClass');
const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the bot ping')
        .setDMPermission(true),
      usage: 'ping',
      category: 'General',
      permissions: ['Use Application Commands', 'Send Messages', 'Attach Files'],
    });
  }

  async run(client, interaction) {
    const now = Date.now();
    await interaction.deferReply();

    // Load background image
    const background = await loadImage('./assets/canva/ping-background.png'); // Replace with your background image path

    // Create canvas with background image dimensions
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    // Draw background image on the canvas
    ctx.drawImage(background, 0, 0);

    // Customize canvas text and styles
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Sans-serif';

    // Draw ping information on the canvas
    ctx.fillText(` Roundtrip: ${Math.round(Date.now() - now)} ms`, 110, 125);
    ctx.fillText(` API: ${Math.round(client.ws.ping)} ms`, 125, 200);

    // Convert canvas to a buffer
    const attachment = new AttachmentBuilder(canvas.toBuffer(), 'ping.png');

    // Create an embedded message with ping details
    const pingEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'Process Ping',
        iconURL: client.user.displayAvatarURL({ size: 2048 }),
      })
      .setColor(0x36393e)
      .setDescription(stripIndents`
        ⏱ Roundtrip: **${Math.round(Date.now() - now)} ms**
        💓 API: **${Math.round(client.ws.ping)} ms**
      `);

    await interaction.followUp({ embeds: [pingEmbed] });
    await interaction.channel.send({ files: [attachment] });
  }
};
