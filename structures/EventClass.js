module.exports = class Event {
/**
 * Represents a constructor for a class.
 * @param {object} client - The client object.
 * @param {object} options - The options for the constructor.
 * @param {string} options.name - The name option.
 * @param {boolean} options.raw - The raw option.
 * @param {boolean} options.once - The once option.
 */
	constructor(client, options = {}) {
		this.client = client;
		this.name = options.name;
		this.raw = options.raw || false;
		this.once = options.once || false;
	}

	/**
 * Runs the event.
 *
 * @throws {Error} If the event does not provide a run method.
 */
	async run() {
		throw new Error(`The Event "${this.name}" does not provide a run method.`);
	}
};