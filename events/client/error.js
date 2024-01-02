const Event = require('../../structures/EventClass');

module.exports = class ErrorEvent extends Event {
	constructor(client) {
		super(client, {
			name: 'error',
			once: false,
		});
	}
	/**
 * Runs the error handler.
 *
 * @param {Error} error - The error object.
 */
	async run(error) {
		if (error.message.includes('Missing')) {
			return;
		}
		else {
			console.log(`[Error]: An error 🔴 occurred at (${new Date().toISOString()}): ${error.message}`);
		}
	}
};