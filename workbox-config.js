module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{html,css,docx,ico,ttf,jpg,jpeg,png,js,json,php,md,xml}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};