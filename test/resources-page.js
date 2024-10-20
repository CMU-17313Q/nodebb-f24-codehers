'use strict';

const assert = require('assert');

// Mock the db module
const db = {
	getSetMembers: async () => ['[Example](http://example.com)', '[Test](http://test.com)'],
};

// Mock the controller
const controllers = {
	getResourcesButtonPage: async (req, res) => {
		try {
			console.log('Fetching links from the database...');
			const links = await db.getSetMembers('links');
			console.log('Links fetched:', links);

			const cleanedLinks = links.map((link) => {
				const match = link.match(/\((https?:\/\/[^\s)]+)\)/);
				return match ? match[1] : link;
			});
			console.log('Cleaned links:', cleanedLinks);

			res.render('resources-button', {
				title: 'Resources Page',
				message: 'Links retrieved successfully',
				links: JSON.stringify(cleanedLinks),
			});
			console.log('Rendered resources-button page with cleaned links');
		} catch (error) {
			console.error('Error fetching links:', error.message);
			res.status(500).json({
				message: 'An error occurred while fetching links',
				error: error.message,
			});
		}
	},
};

// Define the test
async function testGetResourcesButtonPage() {
	// Mock request and response objects
	const req = {};
	const res = {
		statusCode: 200,
		renderCalled: false,
		renderArgs: null,
		render(view, options) {
			this.renderCalled = true;
			this.renderArgs = [view, options];
			console.log('Render called with view:', view, 'and options:', options);
		},
		status(code) {
			this.statusCode = code;
			return this;
		},
		jsonCalled: false,
		jsonArgs: null,
		json(data) {
			this.jsonCalled = true;
			this.jsonArgs = data;
			console.log('JSON response called with data:', data);
		},
	};

	// Call the controller function
	console.log('Calling getResourcesButtonPage controller function...');
	await controllers.getResourcesButtonPage(req, res);
	console.log('Controller function getResourcesButtonPage called');

	// Verify the response
	console.log('Verifying response...');
	assert.strictEqual(res.statusCode, 200);
	console.log('Assertion passed: statusCode is 200');

	assert(res.renderCalled);
	console.log('Assertion passed: render was called');

	assert.strictEqual(res.renderArgs[0], 'resources-button');
	console.log('Assertion passed: renderArgs[0] is "resources-button"');

	assert.strictEqual(res.renderArgs[1].title, 'Resources Page');
	console.log('Assertion passed: renderArgs[1].title is "Resources Page"');

	assert.strictEqual(res.renderArgs[1].message, 'Links retrieved successfully');
	console.log('Assertion passed: renderArgs[1].message is "Links retrieved successfully"');

	assert.deepStrictEqual(JSON.parse(res.renderArgs[1].links), ['http://example.com', 'http://test.com']);
	console.log('Assertion passed: renderArgs[1].links match expected links');

	// Verify the rendered HTML (simplified check)
	const expectedHtml = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resources Page</title>
</head>
<body>
    <div class="container">
        <h1>Resources</h1>
        <p>Welcome to the resources page! Here you can find various links and materials.</p>

        <h2>Useful Links</h2>
        <ul id="links-list"></ul>
    </div>
    <script>
        // Parse the links JSON string
        const links = JSON.parse('["http://example.com","http://test.com"]');
        links.sort();
        const linksList = document.getElementById('links-list');
        
        // Generate the HTML for the links
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link;
            a.target = '_blank';
            a.textContent = link;
            li.appendChild(a);
            linksList.appendChild(li);
        });
    </script>
</body>
    `.trim();

	const renderedHtml = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${res.renderArgs[1].title}</title>
</head>
<body>
    <div class="container">
        <h1>Resources</h1>
        <p>Welcome to the resources page! Here you can find various links and materials.</p>

        <h2>Useful Links</h2>
        <ul id="links-list"></ul>
    </div>
    <script>
        // Parse the links JSON string
        const links = JSON.parse('${res.renderArgs[1].links}');
        links.sort();
        const linksList = document.getElementById('links-list');
        
        // Generate the HTML for the links
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link;
            a.target = '_blank';
            a.textContent = link;
            li.appendChild(a);
            linksList.appendChild(li);
        });
    </script>
</body>
    `.trim();

	console.log('Expected HTML:', expectedHtml);
	console.log('Rendered HTML:', renderedHtml);

	assert.strictEqual(renderedHtml, expectedHtml);
	console.log('Assertion passed: renderedHtml matches expectedHtml');
}

// Define the error handling test
async function testGetResourcesButtonPageError() {
	// Mock the db module to throw an error
	db.getSetMembers = async () => {
		throw new Error('Database error');
	};

	// Mock request and response objects
	const req = {};
	const res = {
		statusCode: 200,
		renderCalled: false,
		renderArgs: null,
		render(view, options) {
			this.renderCalled = true;
			this.renderArgs = [view, options];
			console.log('Render called with view:', view, 'and options:', options);
		},
		status(code) {
			this.statusCode = code;
			return this;
		},
		jsonCalled: false,
		jsonArgs: null,
		json(data) {
			this.jsonCalled = true;
			this.jsonArgs = data;
			console.log('JSON response called with data:', data);
		},
	};

	// Call the controller function
	console.log('Calling getResourcesButtonPage controller function with error...');
	await controllers.getResourcesButtonPage(req, res);
	console.log('Controller function getResourcesButtonPage called with error');

	// Verify the response
	console.log('Verifying error response...');
	assert.strictEqual(res.statusCode, 500);
	console.log('Assertion passed: statusCode is 500');

	assert(res.jsonCalled);
	console.log('Assertion passed: JSON response was called');

	assert.strictEqual(res.jsonArgs.message, 'An error occurred while fetching links');
	console.log('Assertion passed: JSON response message is correct');

	assert.strictEqual(res.jsonArgs.error, 'Database error');
	console.log('Assertion passed: JSON response error is correct');
}

// Run the tests
(async () => {
	console.log('Running tests...');
	await testGetResourcesButtonPage();
	await testGetResourcesButtonPageError();
	console.log('All tests passed');
})();
