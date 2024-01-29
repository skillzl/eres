const Server = require('../database/serverModel');

/**
 * Retrieves the i18n data for the specified server.
 * If the server does not exist, returns the default language code.
 * @param {string} id - The server ID.
 * @returns {Promise<string>} - The i18n data or default language code.
 */
async function get(id) {
	// Find the server with the specified ID
	const server = await Server.findOne({ serverId: id });

	// If the server exists, return the i18n data
	// Otherwise, return the default language code ('en')
	return server ? server.i18n : 'en';
}

/**
 * @param {string} category - The category of the translation
 * @param {string} identifier - The identifier of the translation
 * @param {string} language - The language code for the translation file
 * @returns {string} - The translated message
 */
function handle(category, identifier, language) {
	// Load the translation file for the given language
	const file = require(`../i18n/${language}.json`);

	// Retrieve the translation message based on the category and identifier
	return file[category][identifier];
}

/**
 * Sets up the i18n module for the client.
 * The i18n module provides internationalization support.
 *
 * @param {Object} client - The client object.
 */
module.exports = (client) => {
	// Define the i18n object with the handle and get functions.
	client.i18n = {
		handle: handle,
		get: get,
	};
};
