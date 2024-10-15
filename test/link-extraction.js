// Define the link extraction logic
function extractLinks(text) {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const links = text.match(urlRegex) || [];
	console.log('Extracted links:', links); // Log the extracted links
	return [...new Set(links)]; // Remove duplicates
}

describe('Link Extraction', () => {
	it('should extract a single link from a post', () => {
		const postContent = 'Check this out: http://example.com';
		const expectedLinks = ['http://example.com'];
		const extractedLinks = extractLinks(postContent);
		assert.deepStrictEqual(extractedLinks, expectedLinks);
	});

	it('should extract multiple links from a post', () => {
		const postContent = 'Visit http://example.com and http://test.com';
		const expectedLinks = ['http://example.com', 'http://test.com'];
		const extractedLinks = extractLinks(postContent);
		assert.deepStrictEqual(extractedLinks, expectedLinks);
	});

	it('should return an empty array when no links are present', () => {
		const postContent = 'This post has no links.';
		const expectedLinks = [];
		const extractedLinks = extractLinks(postContent);
		assert.deepStrictEqual(extractedLinks, expectedLinks);
	});

	it('should not extract malformed links', () => {
		const postContent = 'This is not a link: htt://example.com';
		const expectedLinks = [];
		const extractedLinks = extractLinks(postContent);
		assert.deepStrictEqual(extractedLinks, expectedLinks);
	});
});
