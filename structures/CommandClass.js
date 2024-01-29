module.exports = class Command {
/**
 * Creates a new instance of the API class.
 * @param {object} client - The client object.
 * @param {object} meta - The metadata object.
 * @param {object} meta.data - The data object.
 * @param {string|null} meta.contextDescription - The description of the context.
 * @param {string} meta.usage - The usage of the API.
 * @param {string} [meta.category='Info'] - The category of the API.
 * @param {string[]} [meta.permissions=['Use Application Commands', 'Send Messages', 'Embed Links']] - The permissions required for the API.
 */
	constructor(client, meta = {}) {
		this.client = client;
		this.data = meta.data;
		this.contextDescription = meta.contextDescription || null;
		this.usage = meta.usage || this.name;
		this.category = meta.category || 'Info';
		this.permissions = meta.permissions || ['Use Application Commands', 'Send Messages', 'Embed Links'];
	}

	/**
 * Runs the Slash Command.
 * @throws {Error} Throws an error if the Slash Command does not provide a run method.
 */
	async run() {
		throw new Error(`The Slash Command "${this.name}" does not provide a run method.`);
	}
};