require('dotenv').config();
const Client = require('./structures/Client');
const { Player } = require('discord-player');
const { SpotifyExtractor } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const fs = require('fs');

// Initialize client
const client = new Client();

// Initialize player
const player = new Player(client, {
	autoRegisterExtractor: false,
	ytdlOptions: { requestOptions: {
		headers: { cookie: process.env.YOUTUBE_COOKIE ? process.env.YOUTUBE_COOKIE : null,
		},
	} },
});

// Register extractors to player
player.extractors.register(YoutubeiExtractor);
player.extractors.register(SpotifyExtractor);

// Load functions from ./functions
const functions = fs.readdirSync('./functions').filter((file) => file.endsWith('.js'));

for (const file of functions) {
	require(`./functions/${file}`)(client);
}

// Initialize classes
client.events.player();
client.emoji();
client.login();

// Handle process events
process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));
process.on('uncaughtExceptionMonitor', err => console.error(err.stack));

// Handle process exit
process.on('beforeExit', code => console.log(code));
process.on('exit', code => console.log(code));