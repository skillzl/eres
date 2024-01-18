const express = require('express');
const { ChannelType, version } = require('discord.js');
const passport = require('passport');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
require('dayjs/plugin/duration');

const package = require('../package.json');

const { exec } = require('child_process');
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

router.get('/release', async (req, res) => {
	// Set owner and repo variables
	const owner = 'skillzl';
	const repo = 'eres';

	// Construct the URL for fetching the latest release
	const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

	// Add headers for the fetch request
	const headers = {
		'Authorization': `token ${process.env.GITHUB_TOKEN}`,
	};

	const response = await fetch(url, { headers });
	const data = await response.json();

	// Extract only the necessary information
	const release = {
		tagName: data.tag_name,
		name: data.name,
		publishedAt: data.published_at,
		body: data.body,
		author: data.author.login,
		avatarUrl: data.author.avatar_url,
	};

	res.render('release', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		release: release,
	});
});

router.get('/admin/panel', checkAuth, async (req, res) => {
	// Check if the user is allowed
	if (req.user.id !== process.env.DEVELOPER_ID) {
		return res.status(403).send('Not allowed');
	}

	// Set owner and repo variables
	const owner = 'skillzl';
	const repo = 'eres';

	// Construct the URL for fetching commits
	const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`;

	// Add headers for the fetch request
	const headers = {
		'Authorization': `token ${process.env.GITHUB_TOKEN}`,
	};

	const response = await fetch(url, { headers });
	const data_commit = await response.json();
	const commits = data_commit.map(commit => ({
		author: commit.commit.author.name,
		message: commit.commit.message,
		date: commit.commit.author.date,
		url: commit.html_url,
	}));

	// Get the stats from the database
	const { data } = await db.getAnalysticsById(process.env.ANALYTICS_ID);
	const users = data.users;
	const guilds = data.guilds;
	const commands_used = data.commands_used;
	const songs_played = data.songs_played;

	// Fetchh all users from all servers
	const cachedUsers = req.client.guilds.cache.reduce(
		(a, g) => a + g.memberCount,
		0,
	);

	const cachedGuilds = req.client.guilds.cache.size;

	/**
 * Calculates the percentage change in user count between last week and the current week.
 * @param {number} lastWeekUsers - The user count from last week.
 * @param {number} currentWeekUsers - The user count from the current week.
 * @returns {string} - A message indicating the percentage change in user count.
 */
	function calculatePercentageChange(lastWeekUsers, currentWeekUsers) {
	// Calculate the difference in user count between the current week and last week
		const difference = currentWeekUsers - lastWeekUsers;

		// Calculate the percentage change in user count
		const percentageChange = (difference / lastWeekUsers) * 100;

		// Initialize the result variable
		let result = '';

		// Check if the percentage change is positive
		if (percentageChange > 0) {
		// Set the result message for an increase in user count
			result = `${percentageChange.toFixed(2)}% increase from last week`;
		}
		// Check if the percentage change is negative
		else if (percentageChange < 0) {
		// Set the result message for a decrease in user count
			result = `${Math.abs(percentageChange.toFixed(2))}% decrease from last week`;
		}
		// If the percentage change is zero
		else {
		// Set the result message for no change in user count
			result = 'count remained the same';
		}

		// Return the result message
		return result;
	}

	// Calculate the percentage change
	const usersStatus = calculatePercentageChange(users, cachedUsers);
	const guildsStatus = calculatePercentageChange(guilds, cachedGuilds);

	res.render('admin/panel', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		usersStatus: usersStatus || 'count remained the same',
		guildsStatus: guildsStatus || 'count remained the same',
		guilds: cachedGuilds || 0,
		cachedUsers: cachedUsers || 0,
		commands_used: commands_used || 0,
		songs_played: songs_played || 0,
		commits: commits || [],
	});
});

router.post('/restart', checkAuth, async (req, res) => {
	// Check if the user is allowed
	if (req.user.id !== process.env.DEVELOPER_ID) {
		return res.status(403).send('Not allowed');
	}

	// Restart the bot
	exec('pm2 restart all', (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});

	await res.send('Server is restarting');
});

router.get('/logs', checkAuth, async (req, res) => {
	// Check if the user is allowed
	if (req.user.id !== process.env.DEVELOPER_ID) {
		return res.status(403).send('Not allowed');
	}

	// Get the logs
	exec('pm2 logs --nostream', (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		res.send(stdout);
	});
});

router.get('/profile/me', checkAuth, async (req, res) => {
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

router.post('/profile/me', checkAuth, async (req, res) => {
	// Update the user in the database
	const about = req.body.about;
	if (about) {
		await db.updateUserById(req.user.id, { about: about });
	}
	res.redirect('/profile/me');
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