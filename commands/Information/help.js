const { SlashCommandBuilder } = require('discord.js');
const { ButtonInteraction, MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../structures/CommandClass');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName('help')
                .setDescription('Shows a list of available commands.'),
            usage: 'help',
            category: 'Utility',
        });
    }

    async run(client, interaction) {
        const currentPage = 1;
        const maxPages = 2; // Adjust this based on your number of command categories

        const commandsByCategory = {
            // Organize your commands into categories here
            // Example:
            Moderation: ['mute', 'kick', 'ban'],
            Fun: ['meme', 'quote', 'random'],
            // ...
        };

        const categoryList = Object.keys(commandsByCategory);

        const embed = this.buildEmbed(categoryList, currentPage, maxPages);
        const row = this.buildButtonRow(currentPage, maxPages);

        await interaction.reply({ embeds: [embed], components: [row] });
    }

    buildEmbed(categoryList, currentPage, maxPages) {
        const embed = new MessageEmbed()
            .setTitle('Help - Page ' + currentPage + '/' + maxPages)
            .setDescription('Use `/` to start a command.');

        const startIndex = (currentPage - 1) * 5; // Show 5 categories per page
        const endIndex = Math.min(startIndex + 4, categoryList.length - 1);

        const displayedCategories = categoryList.slice(startIndex, endIndex + 1);

        for (const category of displayedCategories) {
            const commands = commandsByCategory[category].join(', ');
            embed.addField(category, commands);
        }

        return embed;
    }

    buildButtonRow(currentPage, maxPages) {
        const row = new MessageActionRow();

        if (currentPage > 1) {
            row.addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('Previous')
                    .setCustomId('help-prev-' + currentPage)
            );
        }

        if (currentPage < maxPages) {
            row.addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('Next')
                    .setCustomId('help-next-' + currentPage)
            );
        }

        return row;
    }

    async handleButtonClick(interaction) {
        const buttonId = interaction.customId;
        const [action, currentPage] = buttonId.split('-');

        if (action === 'help-prev') {
            await this.run(interaction.client, interaction, currentPage - 1);
        } else if (action === 'help-next') {
            await this.run(interaction.client, interaction, currentPage + 1);
        }
    }
};

// Register the button click event listener
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        await interaction.deferReply(); // Defer initial response to prevent timeouts
        await this.commands.get('help').handleButtonClick(interaction);
    }
});
