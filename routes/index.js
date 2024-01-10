const express = require('express');
const { ChannelType, version } = require('discord.js');
const passport = require('passport');
const bodyParser = require('body-parser');
const dayjs = require('dayjs');
require('dayjs/plugin/duration');

const package = require('../package.json');

const router = express.Router();

const db = require('../database/manager');
const checkAuth = require('../middlewares/checkAuth');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
	res.render('index', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		uptime: dayjs(req.client.uptime).format('D [d], H [h], m [m], s [s]'),
		eresVersion: package.version,
		eresName: package.name,
		user: req.user || null,
	});
});

router.get('/privacy', async (req, res) => {
	res.render('privacy', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
	});
});

router.get('/tos', async (req, res) => {
	res.render('tos', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
	});
});

router.get('/profile/:userID/me', checkAuth, async (req, res) => {
	// Check if the user exists
	const userReq = req.client.users.cache.get(req.params.userID);
	if (!userReq) {
		return res.status(404).send('Not allowed');
	}

	/**
 * Calculates the percentage of XP gained within a given range.
 *
 * @param {Number} minXP - The minimum XP value.
 * @param {Number} maxXP - The maximum XP value.
 * @param {Number} currentXP - The current XP value.
 * @returns {String} - The percentage of XP gained, formatted as a string.
 * @throws {Error} - If the currentXP is outside the range of minXP and maxXP.
 */
	function calculatePercentage(minXP, maxXP, currentXP) {
		// Check if currentXP is outside the range of minXP and maxXP
		if (currentXP < minXP || currentXP > maxXP) {
			throw new Error('Invalid XP value. It should be between minXP and maxXP.');
		}

		// Calculate the total XP range
		const totalXP = maxXP - minXP;

		// Calculate the gained XP within the range
		const gainedXP = currentXP - minXP;

		// Calculate the percentage of XP gained
		const percentage = (gainedXP / totalXP) * 100;

		// Format the percentage as a string with 2 decimal places
		return percentage.toFixed(2) + '%';
	}

	// Get the user from the database
	const { user } = await db.getUserById(req.user.id);

	// Calculate the level based on the user's xp
	const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));
	const level = calculateUserXp(user.xp);

	// Calculate the minimum and maximum xp required for the current level
	const minXp = (level * level) / 0.01;
	const maxXp = ((level + 1) * (level + 1)) / 0.01;
	const percentageXp = calculatePercentage(minXp, maxXp, user.xp);

	res.render('profile/me', {
		bot: req.client,
		level: level || 0,
		xp: user.xp.toLocaleString() || 0,
		about: user.about || 0,
		balance: user.balance.toLocaleString() || 0,
		reputation: user.reputation.toLocaleString() || 0,
		user: req.user || null,
		minXp: minXp || 0,
		maxXp: maxXp || 0,
		percentageXp: percentageXp || 0,
	});
});

router.post('/profile/:userID/me', checkAuth, async (req, res) => {
	// Update the user in the database
	const about = req.body.about;
	if (about) {
		await db.updateUserById(req.user.id, { about: about });
	}
	res.redirect('/profile/' + req.user.id + '/me');
});

router.get('/stats', async (req, res) => {
	// Get the stats from the database
	const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);
	const guilds = data.guilds;
	const users = data.users;
	const commands_used = data.commands_used;
	const songs_played = data.songs_played;

	// Fetchh all users from all servers
	const cachedUsers = req.client.guilds.cache.reduce(
		(a, g) => a + g.memberCount,
		0,
	);

	res.render('stats', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		uptime: dayjs(req.client.uptime).format('D [d], H [h], m [m], s [s]'),
		channelType: ChannelType,
		djsVersion: version,
		guilds: guilds || 0,
		users: users || 0,
		commands_used: commands_used || 0,
		songs_played: songs_played || 0,
		mongoDBVersion: package.dependencies['mongoose'],
		cachedUsers: cachedUsers || 0,
	});
});

router.get('/invite', async function(req, res) {
	// Redirect to invite link
	res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&permissions=1098974625783&scope=bot%20applications.commands`);
});

router.get('/support', async function(req, res) {
	// Redirect to support server
	res.redirect(process.env.SUPPORT_SERVER);
});

router.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), async function(req, res) {
	// Redirect to dashboard
	if (!req.user.id || !req.user.guilds) {
		res.redirect('/');
	}
	else {res.redirect('/');}
});

router.get('/logout', async function(req, res) {
	// Logout
	req.logout(() => {
		req.session.destroy(() => {
			res.redirect('/');
		});
	});
});

module.exports = router;