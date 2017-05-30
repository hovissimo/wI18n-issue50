const path = require('path')
const I18nPlugin = require('i18n-webpack-plugin')

const languages = {
	'en': null,
	'de': require('./de.json'),
}


module.exports = Object.keys(languages).map(function(language) {
	return {
		entry: './index.js',
		output: {
			path: path.join(__dirname, 'output'),
			filename: `bundle-${language}.js`,
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						presets: ['es2015', 'react'],
					}
				},
			],
		},
		plugins: [
			new I18nPlugin( languages[language] ),
		],
	}
})
