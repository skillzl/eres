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
	const currentYear = new Date().getFullYear();

	res.render('index', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		uptime: dayjs(req.client.uptime).format('D [d], H [h], m [m], s [s]'),
		eresVersion: package.version,
		eresName: package.name,
		user: req.user || null,
		year: currentYear,
	});
});

router.get('/privacy', async (req, res) => {
	const currentYear = new Date().getFullYear();

	res.render('privacy', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		year: currentYear,
	});
});

router.get('/tos', async (req, res) => {
	const currentYear = new Date().getFullYear();

	res.render('tos', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		year: currentYear,
	});
});

router.get('/profile/:userID/me', checkAuth, async (req, res) => {
	const userReq = req.client.users.cache.get(req.params.userID);
	if (!userReq) {
		return res.status(404).send('Not allowed');
	}

	function calculatePercentage(minXP, maxXP, currentXP) {
		if (currentXP < minXP || currentXP > maxXP) {
			return 'Invalid XP value. It should be between minXP and maxXP.';
		}
		const totalXP = maxXP - minXP;
		const gainedXP = currentXP - minXP;
		const percentage = (gainedXP / totalXP) * 100;
		return percentage.toFixed(2) + '%';
	}

	const currentYear = new Date().getFullYear();

	const { user } = await db.getUserById(req.user.id);

	const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));
	const level = calculateUserXp(user.xp);

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
		year: currentYear,
	});
});

router.post('/profile/:userID/me', checkAuth, async (req, res) => {
	const about = req.body.about;
	if (about) {
		await db.updateUserById(req.user.id, { about: about });
	}
	res.redirect('/profile/' + req.user.id + '/me');
});

router.get('/stats', async (req, res) => {
	const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);
	const guilds = data.guilds;
	const users = data.users;
	const commands_used = data.commands_used;
	const songs_played = data.songs_played;

	const cachedUsers = req.client.guilds.cache.reduce(
		(a, g) => a + g.memberCount,
		0,
	);

	const currentYear = new Date().getFullYear();

	res.render('stats', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		uptime: dayjs(req.client.uptime).format('D [d], H [h], m [m], s [s]'),
		channelType: ChannelType,
		djsVersion: version,
		guilds: guilds,
		users: users,
		commands_used: commands_used,
		songs_played: songs_played,
		mongoDBVersion: package.dependencies['mongoose'],
		cachedUsers: cachedUsers,
		year: currentYear,
	});
});

router.get('/invite', async function(req, res) {
	res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&permissions=1098974625783&scope=bot%20applications.commands`);
});

router.get('/support', async function(req, res) {
	res.redirect(process.env.SUPPORT_SERVER);
});

router.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), async function(req, res) {
	if (!req.user.id || !req.user.guilds) {
		res.redirect('/');
	}
	else {res.redirect('/');}
});

router.get('/logout', async function(req, res) {
	req.logout(() => {
		req.session.destroy(() => {
			res.redirect('/');
		});
	});
});

module.exports = router;