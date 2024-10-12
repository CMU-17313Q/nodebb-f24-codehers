// /Users/alanoudalkhulaifi/Desktop/Software-Engineering/nodebb-f24-codehers/test/extractLinks.test.js

'use strict';

const { expect } = require('chai');
const extractLinks = require('../src/utils/extractLinks');

describe('extractLinks', () => {
    it('should extract links from text', () => {
        const text = 'Check out this link: https://example.com and this one: http://example.org';
        const links = extractLinks(text);
        expect(links).to.deep.equal(['https://example.com', 'http://example.org']);
    });

    it('should return an empty array if no links are found', () => {
        const text = 'No links here!';
        const links = extractLinks(text);
        expect(links).to.deep.equal([]);
    });
});