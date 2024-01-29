module.exports = {
	name: 'error',
	/**
 * Executes the given queue and handles any errors that occur.
 * @param {Queue} queue - The queue to execute.
 * @param {Error} error - The error that occurred.
 */
	async execute(queue, error) {
		// Log the error message with the current date and time
		console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${error.message}`);

		try {
			// Delete the queue
			queue.delete();
		}
		catch (err) {
			// Log the error message with the current date and time if there is an error deleting the queue
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		// Send a message to the queue's metadata channel indicating that an error occurred
		queue.metadata.channel.send({ content: 'An error occurred whilst attempting to perform this action. This media may not be supported.' });

		// Return from the function
		return;
	},
};