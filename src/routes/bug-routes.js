
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../database'); // Assuming you have a database module

router.use(bodyParser.json());

router.post('/submit-bug', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
        const key = `bug:${Date.now()}`;
        await db.setObject(key, { title, description, dateSubmitted: new Date().toISOString() });
        await db.sortedSetAdd('bug:archive', Date.now(), key);
        res.status(200).json({ message: 'Bug submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit bug', error });
    }
});

module.exports = router;