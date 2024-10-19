'use strict';

const assert = require('assert');

// Mock DOM elements
const resourcesButton = {
    addEventListener: (event, callback) => {
        if (event === 'click') {
            resourcesButton.click = callback;
        }
    },
    click: null,
    style: {
        display: 'block'
    }
};

const resourcesPage = {
    style: {
        display: 'none'
    }
};

const linksList = {
    innerHTML: ''
};

// Mock document.getElementById
const document = {
    getElementById: function(id) {
        if (id === 'resources-button') return resourcesButton;
        if (id === 'resources-page') return resourcesPage;
        if (id === 'links-list') return linksList;
        return null;
    }
};

// Mock logger
const logger = {
    info: console.log
};

// Function to extract links from a string
function extractLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

// Mocking the resources button click handler
resourcesButton.addEventListener('click', () => {
    const links = extractLinks('Here are some links: https://example.com http://test.com');
    linksList.innerHTML = links.map(link => `<li>${link}</li>`).join('');
    resourcesPage.style.display = 'block';
    logger.info('resourcesPage.style.display:', resourcesPage.style.display);
    logger.info('linksList.innerHTML:', linksList.innerHTML);
});

// Test Functions
function testResourcesButtonVisibility() {
    console.assert(resourcesButton !== null, 'Resources button visibility test failed');
    console.assert(resourcesButton.style.display !== 'none', 'Resources button visibility test failed');
}

function testResourcesButtonClick() {
    // Simulate the click event
    resourcesButton.click();

    // Verify the resources page is displayed
    assert.strictEqual(resourcesPage.style.display, 'block', 'Resources page should be displayed');

    // Verify the links list is populated correctly
    const expectedLinksHTML = '<li>https://example.com</li><li>http://test.com</li>';
    assert.strictEqual(linksList.innerHTML, expectedLinksHTML, 'Links list should be populated correctly');
}

// Run the tests
(async () => {
    testResourcesButtonVisibility();
    testResourcesButtonClick();
    console.log('All tests passed');
})();