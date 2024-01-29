const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const CommandHandler = require('../handler/Command');
const EventHandler = require('../handler/Event');

module.exports = class BotClient extends Client {
/**
 * Initializes a new instance of the Constructor class.
 * @param {...any} opt - Optional arguments.
 */
	constructor(...opt) {
		super({
			opt,
			partials: [
				Partials.GuildMember,
				Partials.Message,
				Partials.Channel,
				Partials.User,
			],
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildVoiceStates,
			],
			presence: {
				status: 'online',
				activity: [{ name: 'Bot is now starting up...', type: ActivityType.Playing }],
			},
		});

		// Initialize collections for commands and events
		this.commands = new Collection();
		this.events = new Collection();

		// Build event handler and command handler
		new EventHandler(this).build('../events');
		new CommandHandler(this).build('../commands');
	}

	/**
 * Logs in the user using the token from the environment variables.
 * @returns {Promise<void>} A promise that resolves when the login is successful.
 */
	async login() {
		await super.login(process.env.TOKEN);
	}

	/**
 * Exit the program gracefully.
 */
	exit() {
		// Check if already quitting
		if (this.quitting) {
			return;
		}
		// Set quitting flag
		this.quitting = true;
		// Destroy resources
		this.destroy();
	}

	/**
 * Fetches the command associated with the given command name.
 *
 * @param {string} cmd - The name of the command to fetch.
 * @returns {Command} - The command associated with the given command name.
 */
	fetchCommand(cmd) {
		return this.commands.get(cmd);
	}
};