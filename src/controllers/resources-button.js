'use strict';

const controllers = {};

controllers.getResourcesButtonPage = async (req, res) => {
    try {
        const links = await db.getSetMembers('resources:links');
        console.log('Retrieved links:', links); // Log the retrieved links to the console
        res.render('resources-button', {
            title: 'Resources Page', // You can customize the title or add more data as needed
            links,
        });
    } catch (err) {
        console.error('Error retrieving links:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Add the new method to get links for the API
controllers.getLinks = async () => {
    try {
        const links = await db.getSetMembers('resources:links');
        return links;
    } catch (err) {
        console.error('Error retrieving links:', err);
        throw err;
    }
};

module.exports = controllers;