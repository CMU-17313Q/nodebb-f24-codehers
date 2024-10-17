'use strict';

// Import the db module
const db = require('../database');

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
	try {
		const links = await db.getSetMembers('resources:links');
		const cleanedLinks = links.map(link => link.replace(/\]\(.*?\)/g, ''));
		console.log('Extracted links:', cleanedLinks); // Log the cleaned links to the console
		
     	// Construct the response object
	  	const response = {
			message: 'Links fetched successfully',
			links: cleanedLinks,
		};

		// Send the response
		res.status(200).json(response);


		//res.render('resources-button', {
			//title: 'Resources Page', // You can customize the title or add more data as needed
			//links: JSON.stringify(cleanedLinks),
		//});
	} catch (err) {
		console.error('Error retrieving links:', err);
		 // Send error response
		 res.status(500).json({
            message: 'An error occurred while fetching links',
            error: err.message,
        });
		//res.status(500).send('Internal Server Error');
	}
};




module.exports = controllers;
