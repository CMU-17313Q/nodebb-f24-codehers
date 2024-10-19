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
        display: 'block',
    },
};

const resourcesPage = {
    style: {
        display: 'none',
    },
};

const linksList = {
    innerHTML: '',
};

// Mock document.getElementById
const document = {
    getElementById: function (id) {
        if (id === 'resources-button') return resourcesButton;
        if (id === 'resources-page') return resourcesPage;
        if (id === 'links-list') return linksList;
        return null;
    },
};

// Mock logger
const logger = {
    info: console.log,
};

// Define the link extraction logic
function extractLinks(text) {
    const urlRegex = /\[.*?\]\((https?:\/\/[^\s)]+)\)|\bhttps?:\/\/[^\s)]+/g;
    const links = [];

    let match = urlRegex.exec(text);
    while (match !== null) {
        if (match[1]) {
            links.push(match[1]); // Extract URL from Markdown link
        } else {
            links.push(match[0]); // Extract plain URL
        }
        match = urlRegex.exec(text); // Re-execute regex for the next match
    }

    console.log('Raw Extracted links:', links); // Log the extracted links
    return [...new Set(links)]; // Remove duplicates
}

// Mocking the resources button click handler
resourcesButton.addEventListener('click', () => {
    const links = extractLinks('Here are some links: https://example.com http://test.com');
    linksList.innerHTML = links.map(link => `<li>${link}</li>`).join('');
    resourcesPage.style.display = 'block';
    logger.info('resourcesPage.style.display:', resourcesPage.style.display);
    logger.info('linksList.innerHTML:', linksList.innerHTML);
});

// Simple test runner
function runTests() {
    const tests = [];

    function describe(description, fn) {
        console.log(description);
        fn();
    }

    function it(description, fn) {
        tests.push({ description, fn });
    }

    function run() {
        tests.forEach(({ description, fn }) => {
            try {
                fn();
                console.log(`✔ ${description}`);
            } catch (error) {
                console.error(`✖ ${description}`);
                console.error(error);
            }
        });
    }

    // Define tests
    describe('Resources Button Tests', () => {
        it('should verify resources button visibility', () => {
            try {
                assert.notStrictEqual(resourcesButton, null, 'Resources button visibility test failed');
                console.log('Assertion passed: resourcesButton is not null');
                assert.notStrictEqual(resourcesButton.style.display, 'none', 'Resources button visibility test failed');
                console.log('Assertion passed: resourcesButton is visible');
                console.log('Resources button visibility test passed');
            } catch (error) {
                console.error('Resources button visibility test failed:', error.message);
                throw error;
            }
        });

        it('should handle resources button click', () => {
            try {
                // Simulate the click event
                resourcesButton.click();
                console.log('Simulated click event on resourcesButton');

                // Verify the resources page is displayed
                assert.strictEqual(resourcesPage.style.display, 'block', 'Resources page should be displayed');
                console.log('Assertion passed: resourcesPage is displayed');

                // Verify the links list is populated correctly
                const expectedLinksHTML = '<li>https://example.com</li><li>http://test.com</li>';
                assert.strictEqual(linksList.innerHTML, expectedLinksHTML, 'Links list should be populated correctly');
                console.log('Assertion passed: linksList is populated correctly');
                console.log('Resources button click test passed');
            } catch (error) {
                console.error('Resources button click test failed:', error.message);
                throw error;
            }
        });
    });

    // Run tests
    run();
}

// Run the tests
runTests();