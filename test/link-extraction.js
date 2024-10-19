const assert = require('assert');

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

describe('Link Extraction', () => {
    it('should extract a single link from a post', () => {
        console.log('Test 1');
        const postContent = 'Check this out: http://example.com';
        const expectedLinks = ['http://example.com'];
        const extractedLinks = extractLinks(postContent);
        assert.deepStrictEqual(extractedLinks, expectedLinks);
    });

    it('should extract multiple links from a post', () => {
        console.log('Test 2');
        const postContent = 'Visit http://example.com and http://test.com';
        const expectedLinks = ['http://example.com', 'http://test.com'];
        const extractedLinks = extractLinks(postContent);
        assert.deepStrictEqual(extractedLinks, expectedLinks);
    });

    it('should return an empty array when no links are present', () => {
        console.log('Test 3');
        const postContent = 'This post has no links.';
        const expectedLinks = [];
        const extractedLinks = extractLinks(postContent);
        assert.deepStrictEqual(extractedLinks, expectedLinks);
    });
});