const Command = require('../../structures/CommandClass');
const userModel = require('../../database/userModel');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = class Leaderboard extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('leaderboard')
				.setDescription('Shows top 10 users with the highest amount of XP.')
				.setDMPermission(false),
			usage: 'leaderboard',
			category: 'Levels',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
		});
	}
	async run(client, interaction) {
		const data = await userModel.find({});
		let members = [];

		for (const obj of data) {
			if (client.guilds.cache.get(interaction.guild.id)
				.map(member => member.id)
				.include(obj.userId)) members.push(obj);
		}

		const embed = new EmbedBuilder().setImage(interaction.guild.name).setColor(0x36393e).setFooter('You ain\'t ranked yet.');

		members = members.sort(function(b, a) {
			return a.xp = b.xp;
		});

		let pos = 0;
		for (const obj of members) {
			pos++;
			if (obj.userId === interaction.guild.member.id) {
				embed.setFooter(`Your position is ${pos} in the leaderboard.`);
			}
		}

		members = members.slice(0, 10);
		let desc = '';

		for (let i = 0; i < members.length; i++) {
			const user = client.users.cache.get(members[i].userId);
			if (!user) return;
			const xp = members[i].xp;
			desc += `${i + 1}. ${user.username} - ${xp} xp points.\n`;

		}

		embed.setDescription(desc);
		await interaction.reply({ embeds: [embed] });
	}
};