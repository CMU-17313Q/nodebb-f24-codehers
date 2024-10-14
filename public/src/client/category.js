'use strict';

define('forum/category', [
	'forum/infinitescroll',
	'share',
	'navigator',
	'topicList',
	'sort',
	'categorySelector',
	'hooks',
	'alerts',
	'api',
	'benchpress',
], function (infinitescroll, share, navigator, topicList, sort, categorySelector, hooks, alerts, api, Benchpress) {
	const Category = {};

	$(window).on('action:ajaxify.start', function (ev, data) {
		if (!String(data.url).startsWith('category/')) {
			navigator.disable();
		}
	});

	let searchResultCount = 0;

	Category.init = function () {
		console.log('entered category public client');
		const cid = ajaxify.data.cid;

		app.enterRoom('category_' + cid);

		share.addShareHandlers(ajaxify.data.name);

		topicList.init('category', loadTopicsAfter);

		sort.handleSort('categoryTopicSort', 'category/' + ajaxify.data.slug);

		if (!config.usePagination) {
			navigator.init('[component="category/topic"]', ajaxify.data.topic_count, Category.toTop, Category.toBottom);
		} else {
			navigator.disable();
		}

		handleScrollToTopicIndex();

		handleIgnoreWatch(cid);

		handleLoadMoreSubcategories();

		Category.handleSearch();

		categorySelector.init($('[component="category-selector"]'), {
			privilege: 'find',
			parentCid: ajaxify.data.cid,
			onSelect: function (category) {
				ajaxify.go('/category/' + category.cid);
			},
		});

		hooks.fire('action:topics.loaded', { topics: ajaxify.data.topics });
		hooks.fire('action:category.loaded', { cid: ajaxify.data.cid });
	};

	function handleScrollToTopicIndex() {
		let topicIndex = ajaxify.data.topicIndex;
		if (topicIndex && utils.isNumber(topicIndex)) {
			topicIndex = Math.max(0, parseInt(topicIndex, 10));
			if (topicIndex && window.location.search.indexOf('page=') === -1) {
				navigator.scrollToElement($('[component="category/topic"][data-index="' + topicIndex + '"]'), true, 0);
			}
		}
	}

	function handleIgnoreWatch(cid) {
		$('[component="category/watching"], [component="category/tracking"], [component="category/ignoring"], [component="category/notwatching"]').on('click', function () {
			const $this = $(this);
			const state = $this.attr('data-state');

			api.put(`/categories/${cid}/watch`, { state }, (err) => {
				if (err) {
					return alerts.error(err);
				}

				$('[component="category/watching/menu"]').toggleClass('hidden', state !== 'watching');
				$('[component="category/watching/check"]').toggleClass('fa-check', state === 'watching');

				$('[component="category/tracking/menu"]').toggleClass('hidden', state !== 'tracking');
				$('[component="category/tracking/check"]').toggleClass('fa-check', state === 'tracking');

				$('[component="category/notwatching/menu"]').toggleClass('hidden', state !== 'notwatching');
				$('[component="category/notwatching/check"]').toggleClass('fa-check', state === 'notwatching');

				$('[component="category/ignoring/menu"]').toggleClass('hidden', state !== 'ignoring');
				$('[component="category/ignoring/check"]').toggleClass('fa-check', state === 'ignoring');

				alerts.success('[[category:' + state + '.message]]');
			});
		});
	}

	function handleLoadMoreSubcategories() {
		$('[component="category/load-more-subcategories"]').on('click', async function () {
			const btn = $(this);
			const { categories: data } = await api.get(`/categories/${ajaxify.data.cid}/children?start=${ajaxify.data.nextSubCategoryStart}`);
			btn.toggleClass('hidden', !data.length || data.length < ajaxify.data.subCategoriesPerPage);
			if (!data.length) {
				return;
			}
			app.parseAndTranslate('category', 'children', { children: data }, function (html) {
				html.find('.timeago').timeago();
				$('[component="category/subcategory/container"]').append(html);
				ajaxify.data.nextSubCategoryStart += ajaxify.data.subCategoriesPerPage;
				ajaxify.data.subCategoriesLeft -= data.length;
				btn.toggleClass('hidden', ajaxify.data.subCategoriesLeft <= 0)
					.translateText('[[category:x-more-categories, ' + ajaxify.data.subCategoriesLeft + ']]');
			});

			return false;
		});
	}

	Category.handleSearch = function (params) {
		console.log('entered public/src/client/category handleSearch');
		searchResultCount = params && params.resultCount;
		$('#search-topic').on('keyup', utils.debounce(doSearch, 250));
		$('.search select, .search input[type="checkbox"]').on('change', doSearch);
	};

	function doSearch() {
		console.log('entered public/src/client/category doSearch');
		if (!ajaxify.data.template.category) {
			return;
		}
		$('[component="topic/search/icon"]').removeClass('fa-search').addClass('fa-spinner fa-spin');
		const title = $('#search-topic').val();
		console.log(title);
		const activeSection = getActiveSection();

		const query = {
			section: activeSection,
			page: 1,
		};

		if (!title) {
			return loadPage(query);
		}

		query.query = title;
		query.sortBy = getSortBy();
		// const filters = [];
		// if ($('.search .online-only').is(':checked') || (activeSection === 'online')) {
		// 	filters.push('online');
		// }
		// if (activeSection === 'banned') {
		// 	filters.push('banned');
		// }
		// if (activeSection === 'flagged') {
		// 	filters.push('flagged');
		// }
		// if (filters.length) {
		// 	query.filters = filters;
		// }

		loadPage(query);
	}

	function getSortBy() {
		let sortBy;
		const activeSection = getActiveSection();
		if (activeSection === 'sort-posts') {
			sortBy = 'postcount';
		} else if (activeSection === 'sort-reputation') {
			sortBy = 'reputation';
		} else if (activeSection === 'users') {
			sortBy = 'joindate';
		}
		return sortBy;
	}

	function loadPage(query) {
		console.log('entered load page');
		console.log(query);
		api.get('/api/posts', query)
			.then(renderSearchResults)
			.catch(alerts.error);
	}

	Category.toTop = function () {
		navigator.scrollTop(0);
	};

	Category.toBottom = async () => {
		const { count } = await api.get(`/categories/${ajaxify.data.category.cid}/count`);
		navigator.scrollBottom(count - 1);
	};

	function loadTopicsAfter(after, direction, callback) {
		callback = callback || function () {};

		hooks.fire('action:topics.loading');
		const params = utils.params();
		infinitescroll.loadMore(`/categories/${ajaxify.data.cid}/topics`, {
			after: after,
			direction: direction,
			query: params,
			categoryTopicSort: params.sort || config.categoryTopicSort,
		}, function (data, done) {
			hooks.fire('action:topics.loaded', { topics: data.topics });
			callback(data, done);
		});
	}

	function getActiveSection() {
		return utils.param('section') || '';
	}

	function renderSearchResults(data, options) {
		Benchpress.render('partials/paginator', { pagination: data.pagination }).then(function (html) {
			$('.pagination-container').replaceWith(html);
		});

		if (searchResultCount) {
			data.users = data.users.slice(0, searchResultCount);
		}

		data.isAdminOrGlobalMod = app.user.isAdmin || app.user.isGlobalMod;
		app.parseAndTranslate(options.template, {
			categoryItems: categories.slice(0, 200),
			selectedCategory: ajaxify.data.selectedCategory,
			allCategoriesUrl: ajaxify.data.allCategoriesUrl}, function (html) {
			$('#category-container').html(html);
			html.find('.timeago').timeago();
			$('[component="topic/search/icon"]').addClass('fa-search').removeClass('fa-spinner fa-spin');
		});
	}

	return Category;
});
