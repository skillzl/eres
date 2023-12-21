const { SlashCommandBuilder } = require('discord.js');
const Command = require('../../structures/CommandClass');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName('ban')
                .setDescription('Ban a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Select a user')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for the ban')),
            usage: 'ban [@user] [reason]',
            category: 'Moderation',
            permissions: ['Ban Members'], // Update with necessary perms
        });
    }

    async run(client, interaction) {
        if (!interaction.guild || !interaction.member || !interaction.user) {
            return interaction.reply('This command must be used in a server.');
        }

        // Check perms
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!user) {
            return interaction.reply('Please provide a valid user to ban.');
        }

        if (!user.bannable) {
            return interaction.reply('Cannot ban this user.');
        }

        // Ban them
        await user.ban({ reason })
            .then(() => {
                interaction.reply(`Successfully banned ${user.user.tag} for ${reason}`);
            })
            .catch(error => {
                console.error(error);
                interaction.reply('There was an error while banning the user.' + error);
            });
    }
};
