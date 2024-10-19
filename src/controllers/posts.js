'use strict';

const querystring = require('querystring');

const posts = require('../posts');
const privileges = require('../privileges');
const helpers = require('./helpers');
const api = require('../api');
const pagination = require('../pagination');
const user = require('../user');
const meta = require('../meta');

const postsController = module.exports;

postsController.redirectToPost = async function (req, res, next) {
	const pid = parseInt(req.params.pid, 10);
	if (!pid) {
		return next();
	}

	const [canRead, path] = await Promise.all([
		privileges.posts.can('topics:read', pid, req.uid),
		posts.generatePostPath(pid, req.uid),
	]);
	if (!path) {
		return next();
	}
	if (!canRead) {
		return helpers.notAllowed(req, res);
	}

	const qs = querystring.stringify(req.query);
	helpers.redirect(res, qs ? `${path}?${qs}` : path, true);
};

postsController.getRecentPosts = async function (req, res) {
	const page = parseInt(req.query.page, 10) || 1;
	const postsPerPage = 20;
	const start = Math.max(0, (page - 1) * postsPerPage);
	const stop = start + postsPerPage - 1;
	const data = await posts.getRecentPosts(req.uid, start, stop, req.params.term);
	res.json(data);
};

postsController.search = async function (req, res) {
	console.log('got it');
	console.log('entered src/controllers/posts.js');
	try {
		// console.log(req);
		const searchData = await api.posts.search(req, req.query);

		console.log('search data');
		console.log(searchData);

		const section = req.query.section || 'joindate';

		searchData.pagination = pagination.create(req.query.page, searchData.pageCount, req.query);
		searchData[`section_${section}`] = true;
		searchData.displayUserSearch = true;

		const { id } = req.params;
		const { cid } = req.query;
		const page = parseInt(req.query.page, 10) || 1;

		let [isAdmin, isGlobalMod, categoriesData, _privileges] = await Promise.all([
			user.isAdministrator(req.uid),
			user.isGlobalModerator(req.uid),
			helpers.getSelectedCategory(cid),
			Promise.all(['global', 'admin'].map(async type => privileges[type].get(req.uid))),
		]);
		_privileges = { ..._privileges[0], ..._privileges[1] };

		const crumbs = [{ text: '[[pages:post-queue]]', url: id ? '/post-queue' : undefined }];

		const tempData = {
			title: '[[pages:post-queue]]',
			posts: searchData.posts,
			isAdmin: isAdmin,
			canAccept: isAdmin || isGlobalMod,
			...categoriesData,
			allCategoriesUrl: `post-queue${helpers.buildQueryString(req.query, 'cid', '')}`,
			pagination: pagination.create(page, searchData.pageCount),
			breadcrumbs: helpers.buildBreadcrumbs(crumbs),
			enabled: meta.config.postQueue,
			singlePost: !!id,
			privileges: _privileges,
		}

		await render(req, res, tempData); } catch (error) {
			console.log('errored');
			console.error('Error in search controller:', error);
		}
};


async function render(req, res, data) {
	console.log('render is called');
	// res.append('X-Total-Count', data.pageCount);
	res.render('post-queue', data);
}