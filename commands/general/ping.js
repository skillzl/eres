const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

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

		function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
			if (stroke) {
				ctx.strokeStyle = stroke;
				ctx.stroke();
			}
			if (fill) {
				ctx.fillStyle = fill;
				ctx.fill();
			}
		}

		const canvas = createCanvas(550, 215);
		const ctx = canvas.getContext('2d');
		roundRect(ctx, 0, 0, 550, 215, 20, '#23272A');

		ctx.fillStyle = '#ffffff';
		ctx.font = '20px Sans-serif';

		const eres = await loadImage('././assets/eres-transparent.png');
		ctx.drawImage(eres, 50, 150, 35, 35);

		const medal = await loadImage('././assets/canva/reputation-asset.png');
		ctx.drawImage(medal, 200, 25, 35, 35);

		const globe = await loadImage('././assets/canva/online.png');
		const globeSize = 35;
		const globeX = canvas.width - globeSize - 100;
		const globeY = (canvas.height - globeSize) / 2;
		ctx.drawImage(globe, globeX, globeY, globeSize, globeSize);

		ctx.fillText('All Systems Operational', 330, 150);
		ctx.fillText('Roundtrip', 170, 110);
		ctx.fillText(`${Math.round(Date.now() - now)} ms`, 170, 150);
		ctx.fillText('API', 100, 110);
		ctx.fillText(`${Math.round(client.ws.ping)} ms`, 100, 150);

		const attachment = new AttachmentBuilder(canvas.toBuffer(), 'ping.png');
		await interaction.reply({ files: [attachment] });
	}
};
