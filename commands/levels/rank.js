const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');
const userModel = require('../../database/userModel');

const { loadImage, createCanvas } = require('canvas');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');

const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

module.exports = class Rank extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('rank')
				.setDescription('Get your current level')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'rank [user]',
			category: 'Levels',
			permissions: ['Use Application Commands', 'Send Messages', 'Attach Files'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target') || interaction.user;
		const { user } = await db.getUserById(member.id);

		const users = await userModel.find({}).sort('-xp');
		let position = -1;

		for (let i = 0; i < users.length; i++) {
			if (users[i]) {
				if (users[i].userId === member.id) {
					position = i + 1;
				}
			}
		}

		const level = calculateUserXp(user.xp);

		const minXp = (level * level) / 0.01;
		const maxXp = ((level + 1) * (level + 1)) / 0.01;

		const canvas = createCanvas(1026, 285);
		const ctx = canvas.getContext('2d');

		const background = await loadImage('././assets/canva/level-background.png');

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#555555';
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#a4a4a4';
		ctx.fillRect(0, 270, 1026, 20);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.strokeReact = (0, 270, 1026, 20);
		ctx.stroke();

		ctx.fillStyle = '#0c594e';
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 270, ((user.xp - minXp) / (maxXp - minXp)) * 1026, 20);
		ctx.fill();
		ctx.globalAlpha = 1;

		ctx.font = '25px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(`${user.xp}/${maxXp}`, 810, 163);

		ctx.textAlign = 'center';
		ctx.font = 'bold 25px Arial';
		ctx.fillStyle = '#30917d';
		ctx.fillText('XP', 810, 140);

		ctx.textAlign = 'center';
		ctx.font = 'bold 25px Arial';
		ctx.fillStyle = '#30917d';
		ctx.fillText('RANK', 640, 140);

		ctx.font = '25px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(`#${position}`, 640, 163);

		ctx.textAlign = 'center';
		ctx.font = 'bold 25px Arial';
		ctx.fillStyle = '#30917d';
		ctx.fillText('LEVEL', 460, 140);

		ctx.font = '25px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(`${level}`, 460, 163);

		ctx.font = 'bold 32px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText(`${member.username}`, 350, 61);

		ctx.arc(170, 135, 125, 0, Math.PI * 2, true);
		ctx.lineWidth = 6;
		ctx.strokeStyle = '#0c594e';
		ctx.stroke();
		ctx.closePath();
		ctx.clip();

		const avatar = await loadImage(member.displayAvatarURL({ extension: 'png', size: 1024 }));
		ctx.drawImage(avatar, 45, 10, 250, 250);

		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });
		interaction.reply({ files: [attachment] });
	}
};