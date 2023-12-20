// Import stuff
require('dotenv').config();
const Client = require('./structures/Client');
const fs = require('fs');
const client = new Client();
const anotherFileContent = fs.readFileSync('./deploy.js', 'utf8');

// Log into the bot
client.login();

// Run the deploy file to deploy commands
eval(anotherFileContent);

// error
process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));