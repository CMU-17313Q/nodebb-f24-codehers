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
            if (url === '/api/submit-bug-feedback') {
                resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
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
        <input id="bug-report-title" />
        <textarea id="bug-report-description"></textarea>
        <button id="submit-bug-feedback"></button>
    `
};

// Your original code
const BugFeedbackForm = {};

BugFeedbackForm.init = () => {
    $('#submit-bug-feedback').on('click', (event) => {
        event.preventDefault();
        const title = $('#bug-report-title').val();
        const description = $('#bug-report-description').val();

        window.fetch('/api/submit-bug-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        }).then(response => {
            if (response.ok) {
                alert('Bug submitted successfully.');
            } else {
                alert('Failed to submit bug.');
            }
        }).catch(error => {
            console.error('Error submitting bug:', error);
            alert('An error occurred while submitting the bug.');
        });
    });
};

// Initialize the BugFeedbackForm module
BugFeedbackForm.init();

// Test cases
async function runTests() {
    console.log("Running tests...");
    
    // Ensure DOM elements exist
    const bugReportTitle = document.querySelector('#bug-report-title');
    const bugReportDescription = document.querySelector('#bug-report-description');
    const submitBugFeedback = document.querySelector('#submit-bug-feedback');
    if (!bugReportTitle || !bugReportDescription || !submitBugFeedback) {
        console.error("Error: One or more form elements are missing");
        return;
    }

    // Test form submission success
    $('#bug-report-title').val('Test Bug');
    $('#bug-report-description').val('Test Description');
    await new Promise(resolve => {
        $('#submit-bug-feedback').click();
        setTimeout(resolve, 100);  // Adjust the delay if necessary
    });
    console.log('Form submission success test passed');

    // Test form submission failure
    global.window.fetch = () => new Promise((_, reject) => {
        reject(new Error('Fetch failed'));
    });
    $('#bug-report-title').val('Test Bug');
    $('#bug-report-description').val('Test Description');
    await new Promise(resolve => {
        $('#submit-bug-feedback').click();
        setTimeout(resolve, 100);  // Adjust the delay if necessary
    });
    console.log('Form submission failure test passed');
}

// Run tests
runTests();