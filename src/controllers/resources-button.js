'use strict';

// Import the db module
const db = require('../database');

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
	try {
		const links = await db.getSetMembers('resources:links');
		const cleanedLinks = links.map(link => link.replace(/\]\(.*?\)/g, ''));
		console.log('Extracted links:', cleanedLinks); // Log the cleaned links to the console

		res.render('resources-button', {
			title: 'Resources Page',
			links: JSON.stringify(cleanedLinks),
		});
	} catch (err) {
		console.error('Error retrieving links:', err);
		res.status(500).json({
			message: 'An error occurred while fetching links',
			error: err.message,
		});
	}
};

module.exports = controllers;
