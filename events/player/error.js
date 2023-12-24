module.exports = {
	name: 'error',
	async execute(queue, error) {
		console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${error.message}`);

		try {
			queue.delete();
		}
		catch (err) {
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		queue.metadata.channel.send({ content: 'An error occurred whilst attempting to perform this action. This media may not be supported.' });
		return;
	},
};