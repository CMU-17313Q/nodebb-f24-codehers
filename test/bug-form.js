/* eslint-env mocha */
/* global window, document */

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
				},
			};
		} else if (selector === '#bug-report-title') {
			return {
				value: '',
				addEventListener: function (event, handler) {
					this.handler = handler;
				},
			};
		} else if (selector === '#bug-report-description') {
			return {
				value: '',
				addEventListener: function (event, handler) {
					this.handler = handler;
				},
			};
		} else if (selector === 'input[name="_csrf"]') {
			return {
				value: '',
				addEventListener: function (event, handler) {
					this.handler = handler;
				},
			};
		}
		return null;
	},
	createElement: (tagName) => {
		const element = {
			classList: {
				add: function (className) {
					this.className = className;
				},
			},
			_innerHTML: '',
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
			},
		};
		return element;
	},
};

global.window = {
	fetch: (url, options) => new Promise((resolve, reject) => {
		if (url === '/api/admin/submit-bug') {
			resolve({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
		} else {
			reject(new Error('Invalid URL'));
		}
	}),
	alert: (message) => {
		console.log('Alert:', message);
	},
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
				}
				element.value = value;
			}
		},
		click: () => {
			if (element && element.click) {
				element.click();
			}
		},
	};
};

// Mock the DOM structure
global.document.body = {
	innerHTML: `
        <input id="bug-report-title" />
        <textarea id="bug-report-description"></textarea>
        <input name="_csrf" value="mock-csrf-token" />
        <button id="submit-bug-feedback"></button>
    `,
};

// Your original code
const BugFeedbackForm = {};

BugFeedbackForm.init = () => {
	$('#submit-bug-feedback').on('click', (event) => {
		event.preventDefault();
		const title = $('#bug-report-title').val();
		const description = $('#bug-report-description').val();
		const csrfToken = document.querySelector('input[name="_csrf"]').value;

		window.fetch('/api/admin/submit-bug', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-csrf-token': csrfToken, // Include the CSRF token in the request headers
			},
			body: JSON.stringify({ title, description }), // Convert the form data to JSON
		}).then((response) => {
			if (response.ok) {
				// For testing purposes, replace alert with console.log or UI feedback
				console.log('Thank you! We received your feedback.');
			} else {
				console.log('Failed to submit bug.');
			}
		}).catch((error) => {
			console.error('Error submitting bug:', error);
			console.log('An error occurred while submitting the bug.');
		});
	});
};

// Initialize the BugFeedbackForm module
BugFeedbackForm.init();

// Test cases
async function runTests() {
	console.log('Running tests...');

	// Ensure DOM elements exist
	const bugReportTitle = document.querySelector('#bug-report-title');
	const bugReportDescription = document.querySelector('#bug-report-description');
	const submitBugFeedback = document.querySelector('#submit-bug-feedback');
	const csrfTokenInput = document.querySelector('input[name="_csrf"]');
	if (!bugReportTitle || !bugReportDescription || !submitBugFeedback || !csrfTokenInput) {
		console.error('Error: One or more form elements are missing');
		return;
	}

	// Test form submission success
	$('#bug-report-title').val('Test Bug');
	$('#bug-report-description').val('Test Description');
	csrfTokenInput.value = 'mock-csrf-token';
	let fetchCalled = false;
	global.window.fetch = (url, options) => {
		fetchCalled = true;
		const body = JSON.parse(options.body);
		console.assert(body.title === 'Test Bug', 'Title value is incorrect');
		console.assert(body.description === 'Test Description', 'Description value is incorrect');
		console.assert(options.headers['x-csrf-token'] === 'mock-csrf-token', 'CSRF token is incorrect');
		return new Promise((resolve) => {
			resolve({
				ok: true,
				json: () => Promise.resolve({ success: true }),
			});
		});
	};
	await new Promise((resolve) => {
		$('#submit-bug-feedback').click();
		setTimeout(resolve, 100); // Adjust the delay if necessary
	});
	console.assert(fetchCalled, 'Fetch was not called');
	console.log('Form submission success test passed');

	// Test form submission failure
	fetchCalled = false;
	global.window.fetch = () => new Promise((_, reject) => {
		fetchCalled = true;
		reject(new Error('Fetch failed'));
	});
	$('#bug-report-title').val('Test Bug');
	$('#bug-report-description').val('Test Description');
	csrfTokenInput.value = 'mock-csrf-token';
	await new Promise((resolve) => {
		$('#submit-bug-feedback').click();
		setTimeout(resolve, 100); // Adjust the delay if necessary
	});
	console.assert(fetchCalled, 'Fetch was not called');
	console.log('Form submission failure test passed');
}

// Run tests
runTests();

