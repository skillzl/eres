module.exports = {
	name: 'emptyChannel',
	async execute(queue) {
		try {
			queue.delete();
		}
		catch (err) {
			console.log(`[Player]: An error 🔴 occurred at (${new Date().toISOString()}): ${err.message}`);
		}

		queue.metadata.channel.send({ content: `The music was stopped due to \`${formatMS(300000)}\` inactivity.` });
	},
};

function formatMS(ms) {
	const s = Math.floor(ms / 1000) % 60;
	const m = Math.floor(ms / (1000 * 60)) % 60;
	const h = Math.floor(ms / (1000 * 60 * 60));

	let str = '';

	if (h > 0) str += `${h} hour${h > 1 ? 's' : ''}`;
	if (h > 0 && m > 0) str += ', ';
	if (h > 0 && s > 0) str += ' and ';
	if (m > 0) str += `${m} minute${m > 1 ? 's' : ''}`;
	if (m > 0 && s > 0) str += ' and ';
	if (s > 0) str += `${s} second${s > 1 ? 's' : ''}`;

	if (str.length > 0) str += ' of';

	return str;
}