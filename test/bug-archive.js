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
        }
    };
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
function runTests() {
    // Test fetchBugArchive
    window.fetch('/api/admin/get-bug-archive').then(response => response.json()).then((data) => {
        console.assert(data.archive.length === 2, 'fetchBugArchive test failed');
        console.log('fetchBugArchive test passed');
    });

    // Test refresh button click
    $('#submit-bug-feedback').click();
    setTimeout(() => {
        const bugArchiveBody = document.querySelector('#bug-archive-body');
        console.assert(bugArchiveBody.innerHTML.includes('Bug1'), 'refresh button test failed');
        console.assert(bugArchiveBody.innerHTML.includes('Bug2'), 'refresh button test failed');
        console.log('refresh button test passed');
    }, 1000);
}

// Run tests
runTests();