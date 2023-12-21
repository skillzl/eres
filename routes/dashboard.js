const express = require('express');
const { ChannelType, PermissionsBitField } = require('discord.js');
const dayjs = require('dayjs');
require('dayjs/plugin/duration');

const router = express.Router();

const db = require('../database/manager');
const checkAuth = require('../middlewares/checkAuth');

router.get('/server/:guildID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	const roles = server.roles.cache.map(role => ({ name: role.name, id: role.id }));

	if (!req.user.guilds.map(u => u.id).includes(req.params.guildID)) {
		return res.status(403).send('Forbidden');
	}

	let serverData = await db.findServer(req.params.guildID) || await db.createServer(req.params.guildID);

	if (!serverData && server) {
		serverData = await db.createServer(req.params.guildID);
	}

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1098974625783&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	res.render('dashboard/manage.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		channelType: ChannelType,
		serverData: serverData,
		roles: roles,
	});
});

router.post('/server/:guildID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(PermissionsBitField.Flags.ManageGuild)) return res.redirect('/dashboard/servers');

	const data = req.body;

	if (Object.prototype.hasOwnProperty.call(data, 'prefix')) {
		let newprefix;
		let prefix = await db.getPrefix(req.params.guildID);

		if (!prefix || prefix == null) prefix = '!';
		if (data.prefix.length > 0) newprefix = data.prefix;
		if (newprefix) {
			await db.updateServerPrefix(server.id, newprefix);
		}
	}

	if (Object.prototype.hasOwnProperty.call(data, 'autorole')) {
		const newAutorole = data.autorole;
		await db.updateServerAutorole(server.id, newAutorole);
	}

	await res.redirect(`/dashboard/server/${req.params.guildID}`);
});

router.get('/server/:guildID/members', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1098974625783&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

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