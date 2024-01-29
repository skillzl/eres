const BaseEvent = require('../structures/EventClass');
const path = require('path');
const fs = require('fs').promises;

/**
 * Recursively builds events from the given directory and adds them to the client
 * @param {string} dir - The directory to build events from
 */
module.exports = class EventClass {
	constructor(client) {
		this.client = client;
	}

	async build(dir) {
	// Get the full file path of the directory
		const filePath = path.join(__dirname, dir);

		// Get the list of files in the directory
		const files = await fs.readdir(filePath);

		// Loop through each file
		for (const file of files) {
			// Get the file's stats
			const stat = await fs.lstat(path.join(filePath, file));

			// If the file is a directory, recursively call the build function
			if (stat.isDirectory()) this.build(path.join(dir, file));

			// If the file is a JavaScript file and it extends BaseEvent
			if (file.endsWith('.js')) {
				const Event = require(path.join(filePath, file));

				// If the required file is a subclass of BaseEvent
				if (Event.prototype instanceof BaseEvent) {
					const event = new Event(this.client);

					// Add the event to the client events map
					this.client.events.set(event.name, event);

					// Add the event to the client listeners map
					event.once ? this.client.once(event.name, event.run.bind(event)) : this.client.on(event.name, event.run.bind(event));
				}
			}
		}
	}
};