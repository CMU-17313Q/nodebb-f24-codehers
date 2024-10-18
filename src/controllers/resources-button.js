'use strict';

// Import the db module
const Ajv = require('ajv');
const db = require('../database');

const ajv = new Ajv();

// Define the response schema
const responseSchema = {
	type: 'object',
	properties: {
		message: { type: 'string' },
		links: {
			type: 'array',
			items: { type: 'string' },
		},
	},
	required: ['message', 'links'],
};

const validate = ajv.compile(responseSchema);

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

		// Validate the response
		const valid = validate(response);
		if (!valid) {
			console.error(validate.errors);
			return res.status(500).json({
				message: 'Response validation failed',
				errors: validate.errors,
			});
		}
		res.render('resources-button', {
			title: 'Resources Page', // You can customize the title or add more data as needed
			links: JSON.stringify(cleanedLinks),
		});
	} catch (err) {
		console.error('Error retrieving links:', err);
		// Send error response
		res.status(500).json({
			message: 'An error occurred while fetching links',
			error: err.message,
		});
		// res.status(500).send('Internal Server Error');
	}
};

module.exports = controllers;
