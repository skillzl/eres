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
			usage: 'profile [user]',
			category: 'Profile',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links', 'Attach Files'],
		});
	}
	/**
 * Runs the profile generation for a user interaction.
 *
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction data.
 */
	async run(client, interaction) {
	// Defer the reply to indicate that the bot is processing the request.
		await interaction.deferReply();

		// Get the target user from the interaction options, or default to the interaction user.
		const member = interaction.options.getUser('target') || interaction.user;

		// Get the user data from the database.
		const { user } = await db.getUserById(member.id);

		// Calculate the user's level based on their experience points.
		const level = calculateUserXp(user.xp);

		// Set the type based on whether the user is the developer.
		let type = 'user';
		if (user.userId == process.env.DEVELOPER_ID) type = 'developer';

		// Create a canvas and a 2D context.
		const canvas = createCanvas(2000, 2000);
		const ctx = canvas.getContext('2d');

		// Load the background image.
		const background = await loadImage('././assets/canva/profile-background.png');

		// Draw the background image on the canvas.
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		// Configure the drawing properties.
		ctx.beginPath();
		ctx.patternQuality = 'bilinear';
		ctx.filter = 'bilinear';
		ctx.antialias = 'subpixel';
		ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 5;

		// Draw the level text.
		ctx.font = 'bold 124px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText('LEVEL', 1425, 280);

		// Draw the level number.
		ctx.font = 'bold 286px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'center';
		ctx.fillText(level, 1625, 520);

		// Draw the username.
		ctx.font = 'bold 110px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText(member.username, 810, 814);

		// Draw the user type.
		ctx.font = '69px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(type, 810, 899);

		// Draw the "About" label.
		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText('About', 98, 1250);

		// Draw the user's about text.
		ctx.font = '69px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(splice(user.about).toString(), 98, 1390);

		// Draw the "Coins" label.
		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText('Coins', 273, 1760);

		// Draw the user's balance.
		ctx.font = '64px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(user.balance.toLocaleString(), 273, 1850);

		// Draw the "Reputation" label.
		ctx.font = 'bold 75px Arial';
		ctx.fillStyle = '#30917d';
		ctx.textAlign = 'left';
		ctx.fillText('Reputation', 1230, 1760);

		// Draw the user's reputation.
		ctx.font = '64px Arial';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(user.reputation.toLocaleString(), 1230, 1850);

		// Load the user's avatar, reputation badge, and coins badge.
		const avatar = await loadImage(member.displayAvatarURL({ extension: 'png', size: 1024 }));
		const reputation_badge = await loadImage('././assets/canva/reputation-asset.png');
		const coins_badge = await loadImage('././assets/canva/coins-asset.png');

		// Draw the user's avatar, reputation badge, and coins badge.
		ctx.drawImage(coins_badge, 117, 1700, 124, 124);
		ctx.drawImage(reputation_badge, 1095, 1700, 124, 124);
		ctx.drawImage(avatar, 117, 420, 550, 550);
		ctx.stroke();
		ctx.closePath();
		ctx.clip();

		// Create an attachment from the canvas and send it as a reply.
		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });
		interaction.editReply({ files: [attachment] });
	}
};