const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('discord.js');

const { Player } = require('discord-player');

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
					.setAutocomplete(true)),
			usage: 'play [string]',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	/**
 * Runs the command when invoked by the user.
 *
 * @param {Client} client - The Discord client.
 * @param {Interaction} interaction - The interaction object representing the user's command.
 */
	async run(client, interaction) {
	// Defer the reply to indicate that the bot is processing the command
		await interaction.deferReply();

		// Get the voice channel that the user is currently in
		const channel = interaction.member.voice.channel;

		// Check if the user is not in a voice channel
		if (!channel) {
			return await interaction.editReply(`${client.emoji.red_emoji} You aren't currently in a voice channel.`);
		}

		// Check if the bot is already playing music in a different voice channel
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.editReply(`${client.emoji.red_emoji} I can't play music in that voice channel.`);
		}

		// Get the song query from the user's command
		const query = interaction.options.getString('song');

		// Get the player instance
		const player = Player.singleton(client);

		// Get the queue for the current guild
		let queue = player.nodes.get(interaction.guild.id);

		// If the queue doesn't exist, create a new one
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

		// Get the queue again after creating it
		queue = player.nodes.get(interaction.guild.id);

		try {
			// Search for the song using the player
			const res = await player.search(query, {
				requestedBy: interaction.user,
			});

			// If no tracks are found, delete the queue and reply with an error message
			if (!res || !res.tracks || res.tracks.length === 0) {
				if (queue) queue.delete();
				return await interaction.editReply(`${client.emoji.red_emoji} I couldn't find anything with the name \`${query}\`.`);
			}

			try {
				// If the queue is not connected to a voice channel, connect it to the user's voice channel
				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			}
			catch (err) {
				// If an error occurs while connecting to the voice channel, delete the queue and reply with an error message
				if (queue) queue.delete();
				return await interaction.editReply(`${client.emoji.red_emoji} I can't join that voice channel.`);
			}

			try {
				// Add the tracks to the queue and start playing if the queue is not already playing
				res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
				if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
			}
			catch (err) {
				// If an error occurs while playing the media, delete the queue and reply with an error message
				console.log('An error occurred whilst attempting to play this media:');
				console.log(err);

				await queue.delete();
				return await interaction.followUp(`${client.emoji.red_emoji} This media doesn't seem to be working right now, please try again later.`);
			}

			if (!res.playlist) {
				// If a single track is loaded, reply with the track information
				return await interaction.editReply(`${client.emoji.green_emoji} Loaded **${res.tracks[0].title}** by **${res.tracks[0].author}** into the server queue.`);
			}
			else {
				// If a playlist is loaded, reply with the playlist information
				return await interaction.editReply(`${client.emoji.green_emoji} **${res.tracks.length} tracks** from the ${res.playlist.type} **${res.playlist.title}** have been loaded into the server queue.`);
			}
		}
		catch (err) {
			// If an error occurs while searching for the media, reply with an error message
			console.log(err);
			return interaction.editReply(`${client.emoji.red_emoji} An error occurred whilst attempting to play this media.`);
		}
	}
};