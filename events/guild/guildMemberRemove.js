const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

module.exports = class guildMemberRemove extends Event {
	constructor(client) {
		super(client, {
			name: 'guildMemberRemove',
			category: 'guild',
		});
	}
	/**
 * Runs the leave logic for a member.
 * @param {GuildMember} member - The member to run the function for.
 */
	async run(member) {
		try {
		// Helper function to apply text to a canvas
			const applyText = (canvas, text) => {
				const ctx = canvas.getContext('2d');
				let fontSize = 70;
				do {
					ctx.font = `${(fontSize -= 10)}px Sans`;
				} while (ctx.measureText(text).width > canvas.width - 256);
				return ctx.font;
			};

			// Fetch the server information from the database
			const database = await db.findServer(member.guild.id);
			const leave = database?.leave;

			// If leave channel is defined
			if (leave) {
			// Create a canvas
				const canvas = createCanvas(750, 256);
				const ctx = canvas.getContext('2d');

				// Load the background image
				const background_raw = ('././assets/canva/background.png');
				const background = await loadImage(background_raw);
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				// Apply and draw "Goodbye," text
				ctx.font = applyText(canvas, 'Goodbye,');
				ctx.fillStyle = '#ffffff';
				ctx.fillText('Goodbye,', canvas.width / 3, canvas.height / 2.45);

				// Apply and draw the username
				ctx.font = applyText(canvas, `${member.user.username}`);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(
					`${member.user.username}`,
					canvas.width / 3,
					canvas.height / 1.55,
				);

				// Clip the avatar image to a circle and draw it
				ctx.beginPath();
				ctx.arc(130, 130, 100, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();

				const avatar = await loadImage(member.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }));
				ctx.drawImage(avatar, 30, 30, 200, 200);

				// Convert the canvas to a buffer and create an attachment
				const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });

				// Send the attachment to the leave channel
				this.client.channels.cache.get(leave).send({ files: [attachment] });
			}
		}
		catch (e) {
			console.log(e);
		}
	}
};