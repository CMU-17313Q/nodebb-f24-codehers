'use strict';

// Import the db module
const db = require('../database');

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
    try {
        const links = await db.getSetMembers('resources:links');
        const linksHtml = links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('');
        console.log('Generated links HTML:', linksHtml); // Log the generated HTML to the console
        res.render('resources-button', {
            title: 'Resources Page', // You can customize the title or add more data as needed
            linksHtml,
        });
	} catch (err) {
		console.error('Error retrieving links:', err);
		res.status(500).send('Internal Server Error');
	}
};

// Add the new method to get links for the API
controllers.getLinks = async (req, res) => {
	try {
		const links = await db.getSetMembers('resources:links');
		res.json({ links });
	} catch (err) {
		console.error('Error retrieving links:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = controllers;
