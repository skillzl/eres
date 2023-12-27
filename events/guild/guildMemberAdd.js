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
	async run(member) {
		try {
			const applyText = (canvas, text) => {
				const ctx = canvas.getContext('2d');
				let fontSize = 70;
				do {
					ctx.font = `${(fontSize -= 10)}px Sans`;
				} while (ctx.measureText(text).width > canvas.width - 256);
				return ctx.font;
			};

			const database = await db.findServer(member.guild.id);
			const welcome = database?.welcome;
			const autorole = database?.autorole;

			if (welcome) {
				const canvas = createCanvas(750, 256);
				const ctx = canvas.getContext('2d');

				const background_raw = ('././assets/canva/background.png');

				const background = await loadImage(background_raw);
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				ctx.font = applyText(canvas, 'Welcome,');
				ctx.fillStyle = '#ffffff';
				ctx.fillText('Welcome,', canvas.width / 3, canvas.height / 2.45);

				ctx.font = applyText(canvas, `${member.user.username}`);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(
					`${member.user.username}`,
					canvas.width / 3,
					canvas.height / 1.55,
				);

				ctx.beginPath();
				ctx.arc(130, 130, 100, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();

				const avatar = await loadImage(member.user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }));
				ctx.drawImage(avatar, 30, 30, 200, 200);

				const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });
				this.client.channels.cache.get(welcome).send({ files: [attachment] });
			}

			if (autorole) {
				member.roles.add(autorole);
			}
		}
		catch (e) {
			console.log(e);
		}
	}
};