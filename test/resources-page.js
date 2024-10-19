
'use strict';

const assert = require('assert');

// Mock the db module
const db = {
    getSetMembers: async () => {
        return ['[Example](http://example.com)', '[Test](http://test.com)'];
    }
};

// Mock the controller
const controllers = {
    getResourcesButtonPage: async (req, res) => {
        try {
            const links = await db.getSetMembers('links');
            const cleanedLinks = links.map(link => {
                const match = link.match(/\((https?:\/\/[^\s)]+)\)/);
                return match ? match[1] : link;
            });
            res.render('resources-button', {
                title: 'Resources Page',
                message: 'Links retrieved successfully',
                links: JSON.stringify(cleanedLinks)
            });
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred while fetching links',
                error: error.message
            });
        }
    }
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
        }
    };

    // Call the controller function
    await controllers.getResourcesButtonPage(req, res);

    // Verify the response
    assert.strictEqual(res.statusCode, 200);
    assert(res.renderCalled);
    assert.strictEqual(res.renderArgs[0], 'resources-button');
    assert.strictEqual(res.renderArgs[1].title, 'Resources Page');
    assert.strictEqual(res.renderArgs[1].message, 'Links retrieved successfully');
    assert.deepStrictEqual(JSON.parse(res.renderArgs[1].links), ['http://example.com', 'http://test.com']);

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

    assert.strictEqual(renderedHtml, expectedHtml);
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
        }
    };

    // Call the controller function
    await controllers.getResourcesButtonPage(req, res);

    // Verify the response
    assert.strictEqual(res.statusCode, 500);
    assert(res.jsonCalled);
    assert.strictEqual(res.jsonArgs.message, 'An error occurred while fetching links');
    assert.strictEqual(res.jsonArgs.error, 'Database error');
}

// Run the tests
(async () => {
    await testGetResourcesButtonPage();
    await testGetResourcesButtonPageError();
    console.log('All tests passed');
})();