const express = require('express');
const { ChannelType, PermissionsBitField } = require('discord.js');
const dayjs = require('dayjs');
require('dayjs/plugin/duration');

const router = express.Router();

const validator = require('validator');

const db = require('../database/manager');
const checkAuth = require('../middlewares/checkAuth');

router.get('/server/:guildID', checkAuth, async (req, res) => {
	// Check if the user has permission to manage the server
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1098974625783&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	// Get the roles and channels from the server
	await server.roles.fetch();
	await server.channels.fetch();

	const allRoles = server.roles.cache;
	const allChannels = server.channels.cache;

	// Create arrays for the roles and channels
	let allRolesArray = [];
	let textChannelsArray = [];

	//
	const textChannels = allChannels.filter(channel => channel.type === 0);

	// Loop through the roles and channels
	if (allRoles.size) {
		allRolesArray = allRoles.map(role => ({ name: role.name, id: role.id }));
	}
	else {
		console.log('[Dashboard]: No roles found.');
	}

	if (textChannels.size) {
		textChannelsArray = textChannels.map(channel => ({ name: channel.name, id: channel.id }));

	}
	else {
		console.log('[Dashboard]: No text channels found.');
	}

	// Check if the user is in the server
	if (!req.user.guilds.map(u => u.id).includes(req.params.guildID)) {
		return res.status(403).send('Forbidden');
	}

	// Get the server data from the database
	let serverData = await db.findServer(req.params.guildID) || await db.createServer(req.params.guildID);

	// If the server data is not in the database, create it
	if (!serverData && server) {
		serverData = await db.createServer(req.params.guildID);
	}

	res.render('dashboard/manage.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		channelType: ChannelType,
		serverData: serverData,
		roles: allRolesArray,
		channels: textChannelsArray,
	});
});

router.post('/server/:guildID', checkAuth, async (req, res) => {
	// Check if the user has permission to manage the server
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(PermissionsBitField.Flags.ManageGuild)) return res.redirect('/dashboard/servers');

	// Get the data from the request body
	const data = req.body;

	/**
 * Sanitizes the given parse data by escaping any special characters.
 *
 * @param {string} parse_data - The data to be sanitized.
 * @returns {string} - The sanitized data.
 */
	function sanitizeData(parse_data) {
		return validator.escape(parse_data);
	}

	/**
 * Validates the given parse_data.
 *
 * @param {string} parse_data - The data to be validated.
 * @returns {boolean} - True if the data is valid, false otherwise.
 */
	function validateData(parse_data) {
	// Check if parse_data is empty
		if (validator.isEmpty(parse_data)) {
			return false;
		}

		// Check if parse_data is equal to 'Choose a role' or 'Choose a channel'
		if (parse_data === 'Choose a role' || parse_data === 'Choose a channel') {
			return false;
		}

		// Data is valid
		return true;
	}

	// Update the server data in the database
	if (Object.prototype.hasOwnProperty.call(data, 'prefix')) {
		let newprefix;
		let prefix = await db.getPrefix(req.params.guildID);

		if (!prefix || prefix == null) prefix = '!';
		if (data.prefix.length > 0) newprefix = data.prefix;
		if (newprefix) {
			await db.updateServerPrefix(server.id, newprefix);
		}
	}

	// Update the server data in the database
	if (Object.prototype.hasOwnProperty.call(data, 'autorole')) {
		const autorole = sanitizeData(data.autorole);
		if (autorole === 'null') {
			await db.updateServerAutorole(server.id, null);
		}
		else if (validateData(autorole)) {
			await db.updateServerAutorole(server.id, autorole);
		}
	}

	// Update the server data in the database
	if (Object.prototype.hasOwnProperty.call(data, 'welcomeChannel')) {
		const welcomeChannel = sanitizeData(data.welcomeChannel);
		if (welcomeChannel === 'null') {
			await db.updateServerWelcome(server.id, null);
		}
		else if (validateData(welcomeChannel)) {
			await db.updateServerWelcome(server.id, welcomeChannel);
		}
	}

	// Update the server data in the database
	if (Object.prototype.hasOwnProperty.call(data, 'leaveChannel')) {
		const leaveChannel = sanitizeData(data.leaveChannel);
		if (leaveChannel === 'null') {
			await db.updateServerLeave(server.id, null);
		}
		else if (validateData(leaveChannel)) {
			await db.updateServerLeave(server.id, leaveChannel);
		}
	}

	await res.redirect(`/dashboard/server/${req.params.guildID}`);
});


router.get('/server/:guildID/members', checkAuth, async (req, res) => {
	// Check if the user has permission to manage the server
	const server = req.client.guilds.cache.get(req.params.guildID);

	// Check if the user has permission to manage the server and if the user is in the server or if the user is an admin redirect to the invite link
	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1098974625783&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	// Get the members from the server
	const members = server.members.cache.toJSON();

	res.render('dashboard/members.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		members: members,
		dayjs: dayjs,
	});
});

router.get('/server/:guildID/stats', checkAuth, async (req, res) => {
	// Check if the user has permission to manage the server
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1098974625783&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	res.render('dashboard/stats.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		channelType: ChannelType,
		dayjs: dayjs,
	});
});

router.get('/servers', checkAuth, async (req, res) => {
	res.render('dashboard/servers', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591),
	});
});

module.exports = router;