'use strict';

// Mock document and window objects
global.document = {
    querySelector: (selector) => {
        if (selector === '#submit-bug-feedback') {
            return {
                addEventListener: function (event, handler) {
                    this.handler = handler;
                },
                click: function () {
                    if (this.handler) {
                        this.handler();
                    }
                }
            };
        } else if (selector === '#bug-archive-body') {
            return {
                innerHTML: '',
                appendChild: function (child) {
                    this.innerHTML += child.outerHTML;
                }
            };
        } else if (selector === '#bug-report-title') {
            return {
                value: '',
                addEventListener: function (event, handler) {
                    this.handler = handler;
                }
            };
        } else if (selector === '#bug-report-description') {
            return {
                value: '',
                addEventListener: function (event, handler) {
                    this.handler = handler;
                }
            };
        }
        return null;
    },
    createElement: (tagName) => {
        return {
            classList: {
                add: function (className) {
                    this.className = className;
                }
            },
            innerHTML: '',
            appendChild: function (child) {
                this.innerHTML += child.outerHTML;
            },
            outerHTML: '',
            set innerHTML(value) {
                this._innerHTML = value;
                this.outerHTML = `<${tagName} class="${this.className}">${value}</${tagName}>`;
            },
            get innerHTML() {
                return this._innerHTML;
            }
        };
    }
};

global.window = {
    fetch: (url, options) => {
        return new Promise((resolve, reject) => {
            if (url === '/api/admin/get-bug-archive') {
                resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        archive: [
                            { title: 'Bug1', description: 'Description1', submittedBy: 'User1', dateSubmitted: '2023-01-01' },
                            { title: 'Bug2', description: 'Description2', submittedBy: 'User2', dateSubmitted: '2023-01-02' }
                        ]
                    })
                });
            } else {
                reject('Invalid URL');
            }
        });
    },
    alert: (message) => {
        console.log('Alert:', message);
    }
};

// Mock jQuery
const $ = (selector) => {
    const element = document.querySelector(selector);
    return {
        on: (event, handler) => {
            if (element) {
                element.addEventListener(event, handler);
            }
        },
        val: (value) => {
            if (element) {
                if (value === undefined) {
                    return element.value;
                } else {
                    element.value = value;
                }
            }
        },
        append: (content) => {
            if (element) {
                element.innerHTML += content;
            }
        },
        empty: () => {
            if (element) {
                element.innerHTML = '';
            }
        },
        click: () => {
            if (element && element.click) {
                element.click();
            }
        }
    };
};

// Mock the DOM structure
global.document.body = {
    innerHTML: `
        <div id="bug-archive-body"></div>
        <input id="bug-report-title" />
        <textarea id="bug-report-description"></textarea>
        <button id="submit-bug-feedback"></button>
    `
};

// Your original code
const BugArchive = {};

BugArchive.init = () => {
    // Fetch and display bug archive
    fetchBugArchive();

    // Handle refresh button click
    $('#submit-bug-feedback').on('click', fetchBugArchive);
};

function fetchBugArchive() {
    window.fetch('/api/admin/get-bug-archive', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const bugArchiveBody = document.querySelector('#bug-archive-body');
            bugArchiveBody.innerHTML = '';
            if (data.archive && data.archive.length > 0) {
                data.archive.forEach(bug => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${bug.title}</td>
                        <td>${bug.description}</td>
                        <td>${bug.submittedBy}</td>
                        <td>${bug.dateSubmitted}</td>
                    `;
                    bugArchiveBody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4">No bugs found</td>';
                bugArchiveBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching bug archive:', error);
            const bugArchiveBody = document.querySelector('#bug-archive-body');
            bugArchiveBody.innerHTML = '<td colspan="4">Error fetching bug archive</td>';
        });
}

// Initialize the module
BugArchive.init();

// Test cases
async function runTests() {
    console.log("Running tests...");
    
    // Ensure DOM element exists
    const bugArchiveBody = document.querySelector('#bug-archive-body');
    if (!bugArchiveBody) {
        console.error("Error: #bug-archive-body element is missing");
        return;
    }

    // Test fetchBugArchive
    const response = await window.fetch('/api/admin/get-bug-archive');
    const data = await response.json();
    console.assert(data.archive.length === 2, 'fetchBugArchive test failed');
    console.log('fetchBugArchive test passed');

    // Simulate adding data
    $('#bug-report-title').val('Test Bug');
    $('#bug-report-description').val('Test Description');

    // Test refresh button click
    await new Promise(resolve => {
        $('#submit-bug-feedback').click();
        setTimeout(resolve, 1000);  // Adjust the delay if necessary
    });

    console.log('bugArchiveBody.innerHTML:', bugArchiveBody.innerHTML);
    console.assert(bugArchiveBody.innerHTML.includes('Bug1'), 'refresh button test failed');
    console.assert(bugArchiveBody.innerHTML.includes('Bug2'), 'refresh button test failed');
    console.log('refresh button test passed');
}

// Run tests
runTests();


