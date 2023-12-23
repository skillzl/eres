module.exports = {
	name: 'playerError',
	async execute(queue, error) {
		console.log(error.message);

		try {
			queue.delete();
		}
		catch (err) {
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		queue.metadata.channel.send({ content: 'A player error occurred whilst attempting to perform this action.' });
		return;
	},
};
