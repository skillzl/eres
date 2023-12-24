const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player, useMainPlayer, QueryType } = require('discord-player');

module.exports = class Play extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('play')
				.setDescription('Adds a track to the end of the server queue')
				.setDMPermission(false)
				.addStringOption((option) => option.setName('song')
					.setDescription('Enter a track name, artist name, or URL')
					.setRequired(true)
					.setAutocomplete(false)),
			usage: 'play [string]',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		await interaction.deferReply();

		const channel = interaction.member.voice.channel;

		if (!channel) {
			return await interaction.editReply('<:red_emoji:1126936340022435963> You aren\'t currently in a voice channel.');
		}

		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.editReply('<:red_emoji:1126936340022435963> I can\'t play music in that voice channel.');
		}

		const query = interaction.options.getString('song');

		const player = Player.singleton(client);
		let queue = player.nodes.get(interaction.guild.id);

		if (!queue) {
			player.nodes.create(interaction.guild.id, {
				leaveOnEmptyCooldown: 300000,
				leaveOnEndCooldown: 300000,
				leaveOnStopCooldown: 300000,
				selfDeaf: false,
				metadata: {
					channel: interaction.channel,
					client: interaction.guild.members.me,
					requestedBy: interaction.user,
				},
			});
		}

		queue = player.nodes.get(interaction.guild.id);

		try {
			const res = await player.search(query, {
				requestedBy: interaction.user,
			});

			if (!res || !res.tracks || res.tracks.length === 0) {
				if (queue) queue.delete();
				return await interaction.editReply(`<:red_emoji:1126936340022435963> I couldn't find anything with the name \`${query}\`.`);
			}

			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			}
			catch (err) {
				if (queue) queue.delete();
				return await interaction.editReply('<:red_emoji:1126936340022435963> I can\'t join that voice channel.');
			}

			try {
				res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
				if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
			}
			catch (err) {
				console.log('An error occurred whilst attempting to play this media:');
				console.log(err);

				await queue.delete();
				return await interaction.followUp('<:red_emoji:1126936340022435963> This media doesn\'t seem to be working right now, please try again later.');
			}

			if (!res.playlist) {
				return await interaction.editReply(`<:green_emoji:1126936345043030026> Loaded **${res.tracks[0].title}** by **${res.tracks[0].author}** into the server queue.`);
			}
			else {
				return await interaction.editReply(`<:green_emoji:1126936345043030026> **${res.tracks.length} tracks** from the ${res.playlist.type} **${res.playlist.title}** have been loaded into the server queue.`);
			}
		}
		catch (err) {
			console.log(err);
			return interaction.editReply('<:red_emoji:1126936340022435963> An error occurred whilst attempting to play this media.');
		}
	}
	async autocompleteRun(interaction) {
		const player = useMainPlayer();
		const query = interaction.options.getString('query', true);
		const resultsYouTube = await player.search(query, { searchEngine: QueryType.YOUTUBE });
		const resultsSpotify = await player.search(query, { searchEngine: QueryType.SPOTIFY_SEARCH });

		const tracksYouTube = resultsYouTube.tracks.slice(0, 5).map((t) => ({
			name: `YouTube: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
			value: t.url,
		}));

		const tracksSpotify = resultsSpotify.tracks.slice(0, 5).map((t) => ({
			name: `Spotify: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
			value: t.url,
		}));

		const tracks = [];

		tracksYouTube.forEach((t) => tracks.push({ name: t.name, value: t.value }));
		tracksSpotify.forEach((t) => tracks.push({ name: t.name, value: t.value }));

		return interaction.respond(tracks);
	}
};