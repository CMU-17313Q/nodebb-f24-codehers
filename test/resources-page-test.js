'use strict';

const http = require('http');
const assert = require('assert');

// Simulate the Resources page
const server = http.createServer((req, res) => {
	console.log(`Received request for ${req.url}`);
	if (req.url === '/resources') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(`
            <html>
                <head><title>Resources</title></head>
                <body>
                    <h1>Resources</h1>
                    <a href="http://example.com" class="resource-link">Example</a>
                    <a href="http://test.com" class="resource-link">Test</a>
                </body>
            </html>
        `);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not Found');
	}
});

// Start the server
server.listen(3000, async () => {
	console.log('Server running at http://localhost:3000/');

	// Simulate button click by navigating to the Resources page
	http.get('http://localhost:3000/resources', (res) => {
		let data = '';

		// Collect response data
		res.on('data', (chunk) => {
			data += chunk;
		});

		// Verify the response
		res.on('end', () => {
			console.log('Response received');
			assert.strictEqual(res.statusCode, 200, 'Expected status code 200');
			assert(data.includes('<h1>Resources</h1>'), 'Resources page not rendered correctly');
			assert(data.includes('http://example.com'), 'Example link not found');
			assert(data.includes('http://test.com'), 'Test link not found');

			console.log('Resources page rendered correctly');
			server.close();
		});
	}).on('error', (err) => {
		console.error('Error:', err.message);
		server.close();
	});
});
