const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin')
const path = require('path')
const StatsPlugin = require('stats-webpack-plugin');

const languages = {
	'en': null,
	'de': require('./de.json'),
}

const autoprefixerOpts = { browsers: ['last 2 versions'] };
const postcssOpts = { plugins: [ autoprefixer(autoprefixerOpts)], sourceMap: true };

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
				{
					test: /\.s?css$/,
					loader: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{loader: 'css-loader', options: {sourceMap: true}},
							{loader: 'postcss-loader', options: postcssOpts},
							{loader: 'sass-loader', options: {sourceMap: true}},
						],
					}),
				}
			],
		},
		plugins: [
			new I18nPlugin( languages[language] ),
			new StatsPlugin(`manifest.json`, {
				// We only need assetsByChunkName
				chunkModules: false,
				source: false,
				chunks: false,
				modules: false,
				assets: true
			}),
			new ExtractTextPlugin('bundle.css'),
		],
	}
})
