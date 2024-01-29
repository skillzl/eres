const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class guildMemberAdd extends Event {
	constructor(client) {
		super(client, {
			name: 'guildMemberAdd',
			category: 'guild',
		});
	}
	/**
 * Runs the welcome and autorole logic for a member.
 * @param {GuildMember} member - The member to run the logic for.
 */
	async run(member) {
		try {
		// Helper function to apply text to a canvas and determine the appropriate font size.
			const applyText = (canvas, text) => {
				const ctx = canvas.getContext('2d');
				let fontSize = 70;
				do {
					ctx.font = `${(fontSize -= 10)}px Sans`;
				} while (ctx.measureText(text).width > canvas.width - 256);
				return ctx.font;
			};

			// Find server database for the guild the member belongs to.
			const database = await db.findServer(member.guild.id);
			const welcome = database?.welcome;
			const autorole = database?.autorole;

			// If welcome message is enabled, generate and send the welcome message.
			if (welcome) {
				const canvas = createCanvas(750, 256);
				const ctx = canvas.getContext('2d');

				const background_raw = ('././assets/canva/background.png');

				const background = await loadImage(background_raw);
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				// Draw the "Welcome," text on the canvas.
				ctx.font = applyText(canvas, 'Welcome,');
				ctx.fillStyle = '#ffffff';
				ctx.fillText('Welcome,', canvas.width / 3, canvas.height / 2.45);

				// Draw the member's username on the canvas.
				ctx.font = applyText(canvas, `${member.user.username}`);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(
					`${member.user.username}`,
					canvas.width / 3,
					canvas.height / 1.55,
				);

				// Clip the canvas to a circle and draw the member's avatar.
				ctx.beginPath();
				ctx.arc(130, 130, 100, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();

				const avatar = await loadImage(member.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }));
				ctx.drawImage(avatar, 30, 30, 200, 200);

				// Create an attachment from the canvas and send it to the welcome channel.
				const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });
				this.client.channels.cache.get(welcome).send({ files: [attachment] });
			}

			// If autorole is enabled, add the specified role to the member.
			if (autorole) {
				member.roles.add(autorole);
			}
		}
		catch (e) {
			console.log(e);
		}
	}
};