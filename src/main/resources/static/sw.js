// Based on https://github.com/naturalprogrammer/webpush-java-demo/blob/master/src/main/resources/static/sw.js
/**
 * Created by thihara on 8/29/16.
 * 
 * The service worker for displaying push notifications.
 * 
 * https://github.com/thihara/web_push_notifications/blob/master/static/sw.js
 * Apache 2.0
 */


const cacheName = '8';
const staticAssets = [

	'/',
	'/donate-list',
	'/privacy',
	'/tos',
	'/imprint',
	'/faq',

	'/sw.js',
	'/favicon.ico',
	'/manifest/manifest.json',

	'/js/lib/bulma-collapsible.min.js',
	'/js/lib/bulma-slider.min.js',
	'/js/lib/cutter.min.js',
	'/js/lib/fontawesome.all.js',
	'/js/lib/jquery.min.js',
	'/js/lib/Mp3LameEncoder.min.js',
	'/js/lib/notification.js',
	'/js/lib/swiper.all.js',
	'/js/lib/leaflet.min.js',
	'/js/lib/cookies.js',

	'/js/tools/check-password.js',
	'/js/tools/get-notification.js',
	'/js/tools/get-text.js',
	'/js/tools/loader.js',
	'/js/tools/modal.js',
	'/js/tools/refresh-captcha.js',

	'/js/alovoa.js',
	'/js/admin.js',
	'/js/delete-account.js',
	'/js/donate.js',
	'/js/donate-list.js',
	'/js/imprint.js',
	'/js/index.js',
	'/js/login.js',
	'/js/message.js',
	'/js/message-detail.js',
	'/js/password-change.js',
	'/js/password-reset.js',
	'/js/profile.js',
	'/js/pwa-install.js',
	'/js/register.js',
	'/js/register-oauth.js',
	'/js/search.js',
	'/js/user-profile.js',

	'/css/lib/bulma.min.css',
	'/css/lib/bulma.orange.css',
	'/css/lib/bulma.purple.css',
	'/css/lib/bulma.blue.css',
	'/css/lib/bulma-collapsible.min.css',
	'/css/lib/bulma-slider.min.css',
	'/css/lib/bulma-switch.min.css',
	'/css/lib/css-loaders.css',
	'/css/lib/pulse-button.css',
	'/css/lib/swiper.min.css',
	'/css/lib/leaflet.min.css',

	'/css/snips/ui-angular.css',

	'/css/alovoa.css',
	'/css/donate.css',
	'/css/donate-list.css',
	'/css/index.css',
	'/css/message-detail.css',
	'/css/notification.css',
	'/css/privacy.css',
	'/css/search.css',
	'/css/profile.css',
	'/css/user-profile.css',

	'/img/search-cover.webp',
	'/img/banner.webp',
	'/img/ios-pwa.webp',
	'/img/android-chrome-192x192.png',
	'/img/android-chrome-512x512.png',
	'/img/apple-touch-icon.png',
	'/img/f-icon.svg',
	'/img/g-icon.svg',
	'/img/m-icon.svg',
	'/img/t-icon.svg',
	'/img/icon.png'
];

if ('serviceWorker' in navigator) {
	console.log('Loading Service Worker...')
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/sw.js').then(function(registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function(err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}

self.addEventListener('push', function(event) {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	var data = {};
	if (event.data) {
		data = event.data.json();
	}
	var title = data.title;
	var message = data.message;
	var icon = "img/android-chrome-512x512.png";

	self.clickTarget = data.clickTarget;

	event.waitUntil(self.registration.showNotification(title, {
		body: message,
		tag: 'Alovoa',
		icon: icon,
		badge: icon
	}));
});

self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click Received.');

	event.notification.close();

	if (clients.openWindow) {
		event.waitUntil(clients.openWindow(self.clickTarget));
	}
});

self.addEventListener('install', async event => {
	console.log('install event')
	const cache = await caches.open(cacheName);
	await cache.addAll(staticAssets);
});

self.addEventListener('fetch', async event => {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});