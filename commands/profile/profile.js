const Command = require('../../structures/CommandClass');
const db = require('../../database/manager');

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, Canvas } = require('canvas');

const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));
const splice = (s) => (s.length > 40 ? `${s.substring(0, 50)}\n...` : s);

module.exports = class Profile extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('profile')
				.setDescription('Fetch the current profile stats an user have.')
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

		const canvas = createCanvas(2000, 2000);
		const ctx = canvas.getContext('2d');

		ctx.patternQuality = 'bilinear';
		ctx.filter = 'bilinear';
		ctx.antialias = 'subpixel';
		ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 5;

		const backgroundProfile = fs.readFileSync(
			path.join(__dirname, '..', '..', 'assets', 'canva', 'profile.png'),
		);

		const background = await loadImage(backgroundProfile);

		ctx.drawImage(background, 0, 0, 2000, 2000);

		const avatar = await loadImage(member.displayAvatarURL({ extension: 'png', size: 1024 }));

		ctx.drawImage(avatar, 117, 420, 550, 550);

		ctx.font = 'bold 124px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText('LEVEL', 1425, 280);

		ctx.font = 'bold 286px Arial';
		ctx.fillStyle = '#fcbf60';
		ctx.textAlign = 'center';
		ctx.fillText(level, 1625, 520);

		ctx.font = 'bold 110px Arial';
		ctx.fillStyle = '#fcbf60';
		ctx.textAlign = 'left';
		ctx.fillText(member.username, 810, 814);

		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#fcbf60';
		ctx.textAlign = 'left';
		ctx.fillText('About', 98, 1250);

		ctx.font = '69px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(`${splice(user.about).toString()}`, 98, 1390);

		const coinsAsset = fs.readFileSync(
			path.join(__dirname, '..', '..', 'assets', 'coins.png'),
		);

		const coins_badge = await loadImage(coinsAsset);
		ctx.drawImage(coins_badge, 117, 1700, 124, 124);
		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#fcbf60';
		ctx.textAlign = 'left';
		ctx.fillText('Coins', 273, 1760);

		ctx.font = '64px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(`${user.balance.toLocaleString()}`, 273, 1850);

		const repAsset = fs.readFileSync(
			path.join(__dirname, '..', '..', 'assets', 'reputation.png'),
		);

		const reputation_badge = await loadImage(repAsset);
		ctx.drawImage(reputation_badge, 1095, 1700, 124, 124);
		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#fcbf60';
		ctx.textAlign = 'left';
		ctx.fillText('Reputation', 1230, 1760);

		ctx.font = '64px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(`${user.reputation.toLocaleString()}`, 1230, 1850);

		const canvas2 = new Canvas(2000, 2000);
		const ctx2 = canvas2.getContext('2d');

		ctx2.drawImage(canvas, 0, 0, 2000, 2000);

		const attachment = new AttachmentBuilder(canvas2.toBuffer(), { name: 'image.png' });
		interaction.reply({ files: [attachment] });
	}
};