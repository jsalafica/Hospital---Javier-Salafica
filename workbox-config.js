module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{html,css,docx,ico,ttf,jpg,jpeg,png,js,json,php,md,scss,xml}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};