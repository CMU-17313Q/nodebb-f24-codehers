/*'use strict';

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
	// Render the resources-button template
	res.render('resources-button', {
		title: 'Resources Page', // You can customize the title or add more data as needed
	});
};

module.exports = controllers;
*/

const db = require('../database');

async function getResourcesButtonPage(req, res) {
    const links = await db.getSetMembers('resources:links');
    res.render('resources-button', { links });
}

module.exports = {
    getResourcesButtonPage,
};