// test/extractLinks.test.js
const assert = require('assert');

// Mock database
const db = {
    setAdd: async (key, values) => {
        db.data[key] = values;
    },
    data: {}
};

// Function to test
async function extractLinks(postData) {
    const urlRegex = /https?:\/\/[^\s]+/g; // Example regex for URLs
    const links = postData.content.match(urlRegex);
    if (links) {
        await db.setAdd('resources:links', links);
    }
}

// Test case
(async () => {
    // Arrange
    const postData = {
        content: 'Checkout this website: https://www.w3schools.com/html/'
    };
    const expectedLinks = ['https://www.w3schools.com/html/'];

    // Act
    await extractLinks(postData);

    // Assert
    assert.deepStrictEqual(db.data['resources:links'], expectedLinks);
    console.log('Test passed!');
})();