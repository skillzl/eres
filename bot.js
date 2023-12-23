require('dotenv').config();
const Client = require('./structures/Client');

const fs = require('node:fs');

const { Player } = require('discord-player');
const {
	YouTubeExtractor,
	SpotifyExtractor,
	SoundCloudExtractor,
	AppleMusicExtractor,
	VimeoExtractor,
	AttachmentExtractor,
	ReverbnationExtractor } = require('@discord-player/extractor');

const client = new Client();

client.login();

const player = new Player(client, {
	autoRegisterExtractor: false,
});

const functions = fs.readdirSync('./functions').filter((file) => file.endsWith('.js'));

for (const file of functions) {
	require(`./functions/${file}`)(client);
}

client.Player();

player.extractors.register(YouTubeExtractor);
player.extractors.register(SpotifyExtractor);
player.extractors.register(SoundCloudExtractor);
player.extractors.register(AppleMusicExtractor);
player.extractors.register(VimeoExtractor);
player.extractors.register(ReverbnationExtractor);
player.extractors.register(AttachmentExtractor);

process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));