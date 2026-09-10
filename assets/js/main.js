/*
	Dimension by HTML5 UP (html5up.net | @ajlkn)
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)

	Vanilla-JS rewrite — no jQuery / skel. Behaviour is unchanged:
	hash-routed article panels with the same show/hide timing.
*/
(function () {
	'use strict';

	var body = document.body,
		header = document.getElementById('header'),
		footer = document.getElementById('footer'),
		main = document.getElementById('main'),
		articles = main ? Array.prototype.filter.call(main.children, function (el) {
			return el.tagName === 'ARTICLE';
		}) : [],
		delay = 325,
		locked = false;

	if (!main || articles.length === 0) return;

	// Disable animations/transitions until the page has loaded.
	body.classList.add('is-loading');
	window.addEventListener('load', function () {
		window.setTimeout(function () {
			body.classList.remove('is-loading');
		}, 100);
	});

	// Nav: add "middle" alignment classes for an even number of items.
	var nav = header && header.querySelector('nav');
	if (nav) {
		var navItems = nav.querySelectorAll('li');
		if (navItems.length % 2 === 0) {
			nav.classList.add('use-middle');
			navItems[navItems.length / 2].classList.add('is-middle');
		}
	}

	function activeArticle() {
		return articles.filter(function (a) { return a.classList.contains('active'); })[0] || null;
	}

	function show(id, initial) {
		var article = document.getElementById(id);
		if (!article || articles.indexOf(article) === -1) return;

		// Already locked, or initial load? Speed through without delays.
		if (locked || initial === true) {
			body.classList.add('is-switching');
			body.classList.add('is-article-visible');
			articles.forEach(function (a) { a.classList.remove('active'); });
			header.style.display = 'none';
			footer.style.display = 'none';
			main.style.display = '';
			article.style.display = '';
			article.classList.add('active');
			locked = false;
			window.setTimeout(function () {
				body.classList.remove('is-switching');
			}, initial ? 1000 : 0);
			return;
		}

		locked = true;

		if (body.classList.contains('is-article-visible')) {
			// Just swap articles.
			var current = activeArticle();
			if (current) current.classList.remove('active');

			window.setTimeout(function () {
				if (current) current.style.display = 'none';
				article.style.display = '';

				window.setTimeout(function () {
					article.classList.add('active');
					window.scrollTo(0, 0);
					window.setTimeout(function () { locked = false; }, delay);
				}, 25);
			}, delay);
		} else {
			// Open from the landing state.
			body.classList.add('is-article-visible');

			window.setTimeout(function () {
				header.style.display = 'none';
				footer.style.display = 'none';
				main.style.display = '';
				article.style.display = '';

				window.setTimeout(function () {
					article.classList.add('active');
					window.scrollTo(0, 0);
					window.setTimeout(function () { locked = false; }, delay);
				}, 25);
			}, delay);
		}
	}

	function hide(addState) {
		if (!body.classList.contains('is-article-visible')) return;
		var article = activeArticle();

		if (addState === true) history.pushState(null, null, '#');

		if (locked) {
			body.classList.add('is-switching');
			if (article) {
				article.classList.remove('active');
				article.style.display = 'none';
			}
			main.style.display = 'none';
			footer.style.display = '';
			header.style.display = '';
			body.classList.remove('is-article-visible');
			locked = false;
			body.classList.remove('is-switching');
			window.scrollTo(0, 0);
			return;
		}

		locked = true;
		if (article) article.classList.remove('active');

		window.setTimeout(function () {
			if (article) article.style.display = 'none';
			main.style.display = 'none';
			footer.style.display = '';
			header.style.display = '';

			window.setTimeout(function () {
				body.classList.remove('is-article-visible');
				window.scrollTo(0, 0);
				window.setTimeout(function () { locked = false; }, delay);
			}, 25);
		}, delay);
	}

	// Give each article a close button and stop inside clicks from bubbling.
	articles.forEach(function (article) {
		var close = document.createElement('div');
		close.className = 'close';
		close.textContent = 'Close';
		close.addEventListener('click', function () { location.hash = ''; });
		article.appendChild(close);

		article.addEventListener('click', function (event) {
			event.stopPropagation();
		});
	});

	// Click anywhere outside an open article closes it.
	body.addEventListener('click', function () {
		if (body.classList.contains('is-article-visible')) hide(true);
	});

	// Keyboard: Esc closes; 1–4 jump to a section.
	var keyMap = { 49: '#about', 50: '#resume', 51: '#projects', 52: '#contact' };
	window.addEventListener('keyup', function (event) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;

		if (event.keyCode === 27) {
			if (body.classList.contains('is-article-visible')) hide(true);
			return;
		}
		if (keyMap[event.keyCode]) location.hash = keyMap[event.keyCode];
	});

	// Route on hash changes.
	window.addEventListener('hashchange', function () {
		if (location.hash === '' || location.hash === '#') {
			hide();
		} else {
			var id = location.hash.substr(1),
				el = document.getElementById(id);
			if (el && articles.indexOf(el) !== -1) show(id);
		}
	});

	// Don't let the browser scroll back to top on a hashchange.
	if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

	// Initial state: everything hidden.
	main.style.display = 'none';
	articles.forEach(function (a) { a.style.display = 'none'; });

	// Deep link: open the requested article once loaded.
	if (location.hash !== '' && location.hash !== '#') {
		window.addEventListener('load', function () {
			show(location.hash.substr(1), true);
		});
	}
})();
