'use strict';

const express = require('express');
const db = require('../database');
// NodeBB's database module
const router = express.Router();

// Route handler for /resources page
router.get('/resources', async (req, res) => {
	try {
		// Fetch the links from the Redis set
		const links = await db.getSetMembers('resources:links');
        console.log('Retrieved links:', links); // Debugging

		// Render the "Resources" page and pass the extracted links
		res.render('resources', { links });
	} catch (err) {
		console.error('Error fetching resource links:', err);
		res.status(500).send('An error occurred while fetching the resource links.');
	}
});

module.exports = router;
