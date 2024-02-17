const { SlashCommandBuilder } = require('discord.js');
const { GuildMember } = require('discord.js');
const Command = require('../../structures/CommandClass');

module.exports = class Mute extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName('mute')
                .setDescription('Mutes a member for a specified duration.')
                .addUserOption(option => option.setName('member').setDescription('Member to mute'))
                .addNumberOption(option => option.setName('duration').setDescription('Duration of the mute in minutes (default: 30)')),
            usage: 'mute <member> [duration]',
            category: 'Moderation',
            permissions: ['MANAGE_ROLES'], // Required permission to manage roles and timeouts
        });
    }

    async run(client, interaction) {
        const member = interaction.options.getUser('member');
        const duration = interaction.options.getNumber('duration') || 30;

        if (!member) {
            return interaction.reply('Please specify a member to mute.');
        }

        try {
            await member.timeout({
                reason: 'Muted by command',
                duration: duration * 60, // Convert minutes to seconds
            });

            interaction.reply(`${member} has been muted for ${duration} minutes.`);
        } catch (error) {
            console.error('Error muting member:', error);
            interaction.reply('An error occurred while muting the member.');
        }
    }
};
