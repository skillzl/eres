const Event = require('../../structures/EventClass');
const db = require('../../database/manager');

const { InteractionType } = require('discord.js');

module.exports = class InteractionCreate extends Event {
	constructor(client) {
		super(client, {
			name: 'interactionCreate',
			category: 'interactions',
		});
	}
	/**
 * Handles the interaction received by the bot.
 * @param {Interaction} interaction - The interaction object.
 */
	async run(interaction) {
		const client = this.client;

		// Handle application commands
		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = client.commands.get(interaction.commandName);

			// Ignore interactions from bots
			if (interaction.user.bot) {
				return;
			}

			// Reply if the interaction is not in a guild
			if (!interaction.inGuild()) {
				return interaction.reply({
					content: 'You must be in a server to use commands.',
				});
			}

			// Handle unavailable command
			if (!command) {
				return interaction.reply({
					content: 'This command is unavailable. *Check back later.*',
					ephemeral: true,
				}) && client.commands.delete(interaction.commandName);
			}

			// Run the command and add value in database
			try {
				command.run(client, interaction);
				db.incrementCommandsUsed();
			}
			catch (e) {
				console.log(e);
				return interaction.reply({
					content: `An error has occurred.\n\n**\`${e.message}\`**`,
				});
			}
		}

		// Handle modal submit interactions
		if (interaction.type === InteractionType.ModalSubmit) {
			if (interaction.customId === 'prefixForm') {
				const prefix = interaction.fields.getTextInputValue('prefix');
				const reason = interaction.fields.getTextInputValue('reason');

				db.updateServerPrefix(interaction.guild.id, prefix);
				return await interaction.reply({
					content: `Prefix has been set to: **\`${prefix}\`**\n**Reason:** ${reason}`,
				});
			}
		}
	}
};