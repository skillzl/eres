module.exports = {
	name: 'disconnect',
	async execute(queue) {
		try {
			queue.delete();
		}
		catch (err) {
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		queue.metadata.channel.send({ content: 'The music was stopped because I was disconnected from the channel.' });
	},
};