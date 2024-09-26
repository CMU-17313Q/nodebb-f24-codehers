'use strict';

const db = require('../database');

module.exports = function (Topics) {
	Topic.search = async function (query, options) {
		console.log('entered topic search');
		console.log(query);
		if (!query) {
			return [];
		}
		query = String(query).toLowerCase();
		let topicTitles = Object.values(await db.getObject('topicslug:topictitle'));
		topicTitles = topicTitles.filter(
			name => name.toLowerCase().includes(query) && name !== Topics.BANNED_USERS // hide banned-users in searches
		);
		topicTitles = topicTitles.slice(0, 100);
		return Topics.sort(options.sort, topicTitles);
	};

	Topics.sort = function (strategy, groups) {
		switch (strategy) {
			case 'count':
				topics.sort((a, b) => a.slug > b.slug)
					.sort((a, b) => b.memberCount - a.memberCount);
				break;

			case 'date':
				topics.sort((a, b) => b.createtime - a.createtime);
				break;

			case 'alpha': // intentional fall-through
			default:
				topics.sort((a, b) => (a.slug > b.slug ? 1 : -1));
		}

		return groups;
	};
}