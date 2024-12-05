const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs');
const axios = require('axios');

// Base URL of your website
const BASE_URL = 'https://www.eres.lol';

// Discord API configuration
const DISCORD_API_URL = 'https://discord.com/api/v9/users/@me/guilds';
const DISCORD_API_TOKEN = process.env.TOKEN;

// Static pages
const staticPages = [
	{ url: '/', changefreq: 'daily', priority: 0.7 },
	{ url: '/tos', changefreq: 'monthly', priority: 0.5 },
	{ url: '/privacy', changefreq: 'monthly', priority: 0.5 },
	{ url: '/stats', changefreq: 'monthly', priority: 0.5 },
	{ url: '/release', changefreq: 'monthly', priority: 0.5 },
	{ url: '/dashboard/servers', changefreq: 'weekly', priority: 0.8 },
	{ url: '/profile/me', changefreq: 'weekly', priority: 0.8 },
	{ url: '/admin/panel', changefreq: 'weekly', priority: 0.8 },
];

/**
 * Fetches a list of server IDs from the Discord API and maps them to
 * sitemap URLs.
 *
 * @returns {Promise<Array<Object>>} An array of sitemap URLs with
 *   `url`, `changefreq`, and `priority` properties.
 */
async function fetchServerManageUrls() {
	try {
		const { data } = await axios.get(DISCORD_API_URL, {
			headers: {
				Authorization: `Bot ${DISCORD_API_TOKEN}`,
			},
		});

		return data.map((guild) => ({
			url: `/dashboard/server/${guild.id}`,
			changefreq: 'weekly',
			priority: 0.8,
		}));
	}
	catch (error) {
		console.error('Error fetching server IDs from Discord API:', error);
		return [];
	}
}

/**
 * Generates a sitemap XML file by combining static and dynamic pages.
 * Fetches dynamic server management URLs from the Discord API and merges
 * them with predefined static page URLs. The combined list of URLs is then
 * converted to an XML sitemap format and saved to 'public/sitemap.xml'.
 * Logs success message upon completion or logs an error if the process fails.
 */
async function generateSitemap() {
	try {
		// Fetch dynamic manage pages
		const dynamicPages = await fetchServerManageUrls();
		const links = [...staticPages, ...dynamicPages];

		// Write the sitemap to a file
		const stream = new SitemapStream({ hostname: BASE_URL });
		const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
			data.toString(),
		);

		// Save the sitemap to a file
		fs.writeFileSync('public/sitemap.xml', xml);
		console.log('Sitemap generated successfully!');
	}
	catch (error) {
		console.error('Error generating sitemap:', error);
	}
}


// Generate sitemap
generateSitemap();