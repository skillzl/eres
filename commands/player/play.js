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
					.setRequired(true)),
			usage: 'play [string]',
			category: 'Player',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		await interaction.deferReply();

		const channel = interaction.member.voice.channel;

		if (!channel) {
			return await interaction.editReply(`${client.emoji.red_emoji} You aren't currently in a voice channel.`);
		}

		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.editReply(`${client.emoji.red_emoji} I can't play music in that voice channel.`);
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
				return await interaction.editReply(`${client.emoji.red_emoji} I couldn't find anything with the name \`${query}\`.`);
			}

			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			}
			catch (err) {
				if (queue) queue.delete();
				return await interaction.editReply(`${client.emoji.red_emoji} I can't join that voice channel.`);
			}

			try {
				res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
				if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
			}
			catch (err) {
				console.log('An error occurred whilst attempting to play this media:');
				console.log(err);

				await queue.delete();
				return await interaction.followUp(`${client.emoji.red_emoji} This media doesn't seem to be working right now, please try again later.`);
			}

			if (!res.playlist) {
				return await interaction.editReply(`${client.emoji.green_emoji} Loaded **${res.tracks[0].title}** by **${res.tracks[0].author}** into the server queue.`);
			}
			else {
				return await interaction.editReply(`${client.emoji.green_emoji} **${res.tracks.length} tracks** from the ${res.playlist.type} **${res.playlist.title}** have been loaded into the server queue.`);
			}
		}
		catch (err) {
			console.log(err);
			return interaction.editReply(`${client.emoji.red_emoji} An error occurred whilst attempting to play this media.`);
		}
	}
};