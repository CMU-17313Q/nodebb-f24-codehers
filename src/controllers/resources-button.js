'use strict';

const db = require('../database');

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
	try {
		const links = await db.getSetMembers('resources:links');
		console.log('Retrieved links:', links); // Debugging
		res.render('resources', {
			title: 'Resources Page', // You can customize the title or add more data as needed
			links,
		});
	} catch (err) {
		console.error('Error retrieving links:', err);
		res.status(500).send('Internal Server Error');
	}
};

module.exports = controllers;
