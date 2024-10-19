'use strict';

const _ = require('lodash');
const meta = require('../meta');
const plugins = require('../plugins');
const db = require('../database');
const utils = require('../utils');

module.exports = function (Topic) {

	// Topics.search = async function (tid, term) {
	// 	if (!tid || !term) {
	// 		throw new Error('[[error:invalid-data]]');
	// 	}
	
	// 	// Normalize the search term for case-insensitivity
	// 	term = term.toLowerCase();
	
	// 	// Fetch topics related to the provided tid
	// 	const topics = await Topics.getTopicsByTid(tid); // Implement this method to fetch topics
	
	// 	// Filter topics based on the search term in the title
	// 	const matchedTopics = topics.filter(topic => 
	// 		topic.title.toLowerCase().includes(term)
	// 	);
	
	// 	// Fire plugin hooks for additional processing, if needed
	// 	const result = await plugins.hooks.fire('filter:topic.search', {
	// 		tid: tid,
	// 		term: term,
	// 		ids: matchedTopics.map(topic => topic.tid),
	// 	});
	
	// 	return Array.isArray(result) ? result : result.ids;
	// };
		
	const filterFnMap = {
		pinned: topic => topic.pinned > 0,
		locked: topic => topic.locked > 0,
		// Add other filters as needed
	};

	const filterFieldMap = {
		pinned: ['pinned'],
		locked: ['locked'],
		// Map other relevant fields
	};

	Topic.search = async function (data) {
		console.log('hit it');

		const query = data.query || '';
		const searchBy = data.searchBy || 'title'; // Change this as needed
		const page = data.page || 1;
		const paginate = data.hasOwnProperty('paginate') ? data.paginate : true;

		const startTime = process.hrtime();

		let tids = [];
		if (searchBy === 'tid') {
			tids = [query]; // Searching by topic ID
		} else {
			tids = await findTids(query, searchBy);
		}

		tids = await filterAndSortTids(tids, data);
		const result = await plugins.hooks.fire('filter:topics.search', { tids });
		tids = result.tids;

		const searchResult = {
			matchCount: tids.length,
		};

		if (paginate) {
			const resultsPerPage = data.resultsPerPage || meta.config.topicSearchResultsPerPage;
			const start = Math.max(0, page - 1) * resultsPerPage;
			const stop = start + resultsPerPage;
			searchResult.pageCount = Math.ceil(tids.length / resultsPerPage);
			tids = tids.slice(start, stop);
		}

		const topicData = await Topic.getTopics(tids); // You need to implement this
		searchResult.topics = topicData.filter(topic => topic && topic.tid > 0);
		searchResult.timing = (process.elapsedTimeSince(startTime) / 1000).toFixed(2);

		console.log('topics search result)');
		console.log(searchResult);
		return searchResult;
	};

	async function findTids(query, searchBy) {
		if (!query) {
			return [];
		}
		query = String(query).toLowerCase();
		const min = query;
		const max = query.substr(0, query.length - 1) + String.fromCharCode(query.charCodeAt(query.length - 1) + 1);

		const data = await db.getSortedSetRangeByLex(`${searchBy}:sorted`, min, max, 0, meta.config.topicSearchResultsPerPage * 10);
		const tids = data.map(data => data.split(':').pop());
		console.log('dataaa');
		console.log(searchResult);
		return tids;
	}

	async function filterAndSortTids(tids, data) {
		tids = tids.filter(tid => parseInt(tid, 10));
		let filters = data.filters || [];
		filters = Array.isArray(filters) ? filters : [data.filters];
		const fields = [];

		if (data.sortBy) {
			fields.push(data.sortBy);
		}

		filters.forEach((filter) => {
			if (filterFieldMap[filter]) {
				fields.push(...filterFieldMap[filter]);
			}
		});

		if (!fields.length) {
			return tids;
		}

		fields.push('tid');
		let topicData = await Topic.getTopicsFields(tids, fields); // You need to implement this

		filters.forEach((filter) => {
			if (filterFnMap[filter]) {
				topicData = topicData.filter(filterFnMap[filter]);
			}
		});

		if (data.sortBy) {
			sortTopics(topicData, data.sortBy, data.sortDirection);
		}

		return topicData.map(topic => topic.tid);
	}

	function sortTopics(topicData, sortBy, sortDirection) {
		if (!topicData || !topicData.length) {
			return;
		}
		sortDirection = sortDirection || 'desc';
		const direction = sortDirection === 'desc' ? 1 : -1;

		const isNumeric = utils.isNumber(topicData[0][sortBy]);
		if (isNumeric) {
			topicData.sort((t1, t2) => direction * (t2[sortBy] - t1[sortBy]));
		} else {
			topicData.sort((t1, t2) => {
				if (t1[sortBy] < t2[sortBy]) {
					return direction * -1;
				} else if (t1[sortBy] > t2[sortBy]) {
					return direction * 1;
				}
				return 0;
			});
		}
	}
};
