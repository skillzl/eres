const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const { createCanvas, loadImage } = require('canvas');

const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));
const splice = (s) => (s.length > 40 ? `${s.substring(0, 50)}\n...` : s);

module.exports = class Profile extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('profile')
				.setDescription('Fetch the current profile stats an user have')
				.addUserOption(option => option.setName('target').setDescription('The user')
					.setRequired(false))
				.setDMPermission(false),
			usage: 'profile',
			category: 'Profile',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const member = interaction.options.getUser('target') || interaction.user;
		const { user } = await db.getUserById(member.id);

		const level = calculateUserXp(user.xp);

		let type = 'user';
		if (user.userId == process.env.DEVELOPER_ID) type = 'developer';

		const canvas = createCanvas(2000, 2000);
		const ctx = canvas.getContext('2d');

		const background = await loadImage('././assets/canva/profile-background.png');

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.patternQuality = 'bilinear';
		ctx.filter = 'bilinear';
		ctx.antialias = 'subpixel';
		ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 5;

		ctx.font = 'bold 124px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText('LEVEL', 1425, 280);

		ctx.font = 'bold 286px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'center';
		ctx.fillText(level, 1625, 520);

		ctx.font = 'bold 110px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText(member.username, 810, 814);

		ctx.font = '69px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(type, 810, 899);

		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText('About', 98, 1250);

		ctx.font = '69px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(`${splice(user.about).toString()}`, 98, 1390);

		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText('Coins', 273, 1760);

		ctx.font = '64px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(`${user.balance.toLocaleString()}`, 273, 1850);

		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText('Reputation', 1230, 1760);

		ctx.font = '64px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(`${user.reputation.toLocaleString()}`, 1230, 1850);

		const avatar = await loadImage(member.displayAvatarURL({ extension: 'png', size: 1024 }));
		const reputation_badge = await loadImage('././assets/canva/reputation-asset.png');
		const coins_badge = await loadImage('././assets/canva/coins-asset.png');

		ctx.drawImage(coins_badge, 117, 1700, 124, 124);
		ctx.drawImage(reputation_badge, 1095, 1700, 124, 124);
		ctx.drawImage(avatar, 117, 420, 550, 550);
		ctx.stroke();
		ctx.closePath();
		ctx.clip();

		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });
		interaction.reply({ files: [attachment] });
	}
};