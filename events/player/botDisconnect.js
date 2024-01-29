module.exports = {
	name: 'disconnect',
	/**
 * Stops the music playback and sends a message to the channel.
 *
 * @param {Queue} queue - The queue object.
 */
	async execute(queue) {
		try {
		// Delete the queue.
			queue.delete();
		}
		catch (err) {
		// Log the error message with a timestamp.
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		// Send a message to the channel indicating that the music was stopped.
		queue.metadata.channel.send({ content: 'The music was stopped because I was disconnected from the channel.' });
	},
};