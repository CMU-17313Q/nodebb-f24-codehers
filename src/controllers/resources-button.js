'use strict';

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
	// Return a JSON response to match the API schema definition
	res.status(200).json({
		message: 'Resources button data retrieved successfully',
	});
};

module.exports = controllers;
