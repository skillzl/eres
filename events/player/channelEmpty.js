module.exports = {
	name: 'emptyChannel',
	/**
 * Executes the queue operation.
 * Deletes the queue and sends a message to the channel.
 * If there is an error, logs the error message.
 * @param {Queue} queue - The queue object.
 */
	async execute(queue) {
		try {
			queue.delete();
		}
		catch (err) {
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		// Send a message to the channel
		queue.metadata.channel.send({ content: `The music was stopped due to \`${formatMS(300000)}\` inactivity.` });
	},
};

/**
 * Format milliseconds into a human-readable string representation of time.
 *
 * @param {number} ms - The number of milliseconds to format.
 * @returns {string} - The formatted time string.
 */
function formatMS(ms) {
	// Calculate the number of seconds, minutes, and hours
	const s = Math.floor(ms / 1000) % 60;
	const m = Math.floor(ms / (1000 * 60)) % 60;
	const h = Math.floor(ms / (1000 * 60 * 60));

	// Initialize an empty string to store the formatted time
	let str = '';

	// Add hours to the string if it's greater than 0
	if (h > 0) str += `${h} hour${h > 1 ? 's' : ''}`;

	// Add a comma if both hours and minutes are present
	if (h > 0 && m > 0) str += ', ';

	// Add "and" if both hours and seconds are present
	if (h > 0 && s > 0) str += ' and ';

	// Add minutes to the string if it's greater than 0
	if (m > 0) str += `${m} minute${m > 1 ? 's' : ''}`;

	// Add "and" if both minutes and seconds are present
	if (m > 0 && s > 0) str += ' and ';

	// Add seconds to the string if it's greater than 0
	if (s > 0) str += `${s} second${s > 1 ? 's' : ''}`;

	// Add "of" to the string if it's not empty
	if (str.length > 0) str += ' of';

	return str;
}
