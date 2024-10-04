'use strict';

const controllers = {};
controllers.getResourcesButtonPage = async (req, res) => {
	res.render('resources-button', {
		title: 'Resources Page', // You can customize the title or add more data as needed
	});
};

module.exports = controllers;
