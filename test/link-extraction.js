'use strict';

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
	describe('Link Extraction', () => {
		it('should extract multiple links from a post', () => {
			console.log('Test 1: Extracting multiple links');
			const postContent = 'Visit http://example.com and http://test.com';
			const expectedLinks = ['http://example.com', 'http://test.com'];
			const extractedLinks = extractLinks(postContent);
			assert.deepStrictEqual(extractedLinks, expectedLinks);
			console.log('Assertion passed: Extracted links match expected links');
		});

		it('should extract links from Markdown format', () => {
			console.log('Test 2: Extracting links from Markdown format');
			const postContent = 'Check out [Example](http://example.com) and [Test](http://test.com)';
			const expectedLinks = ['http://example.com', 'http://test.com'];
			const extractedLinks = extractLinks(postContent);
			assert.deepStrictEqual(extractedLinks, expectedLinks);
			console.log('Assertion passed: Extracted links match expected links');
		});

		it('should remove duplicate links', () => {
			console.log('Test 3: Removing duplicate links');
			const postContent = 'Visit http://example.com and http://example.com again';
			const expectedLinks = ['http://example.com'];
			const extractedLinks = extractLinks(postContent);
			assert.deepStrictEqual(extractedLinks, expectedLinks);
			console.log('Assertion passed: Duplicate links removed');
		});
	});

	// Run tests
	run();
}

// Run the tests
runTests();
