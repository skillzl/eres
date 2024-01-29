const BaseCommand = require('../structures/CommandClass');
const path = require('path');
const { readdir, lstat } = require('fs').promises;

module.exports = class CommandClass {
	constructor(client) {
		this.client = client;
	}

	/**
 * Recursively builds a command tree from a directory.
 *
 * @param {string} dir - The directory path to build the command tree from.
 */
	async build(dir) {
		// Get the full file path
		const filePath = path.join(__dirname, dir);

		// Read the directory
		const files = await readdir(filePath);

		// Iterate through each file
		for (const file of files) {
			// Get the file's stats
			const stat = await lstat(path.join(filePath, file));

			// If the file is a directory, recursively call the build function
			if (stat.isDirectory()) {
				this.build(path.join(dir, file));
			}

			// If the file is a JavaScript file
			if (file.endsWith('.js')) {
				// Require the file
				const Command = require(path.join(filePath, file));

				// If the required file is a subclass of BaseCommand
				if (Command.prototype instanceof BaseCommand) {
					// Create a new instance of the command
					const cmd = new Command(this.client);

					// Get the command's data
					const cmdData = cmd.data.toJSON();

					// Create a new command object with selected properties
					const cmdSet = {
						name: cmdData.name,
						description: cmdData.description,
						options: cmdData.options,
						defaultPermission: cmdData.default_permission,
						contextDescription: cmd.contextDescription,
						usage: cmd.usage,
						category: cmd.category,
						permissions: cmd.permissions,
						run: cmd.run,
					};

					// Add the command to the client's commands map
					this.client.commands.set(cmdSet.name, cmdSet);
				}
			}
		}
	}
};