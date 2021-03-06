const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin')
const path = require('path')
const StatsPlugin = require('stats-webpack-plugin');
const webpack = require('webpack')

const languages = {
	'en': null,
	'de': require('./de.json'),
}

const autoprefixerOpts = { browsers: ['last 2 versions'] };
const postcssOpts = { plugins: [ autoprefixer(autoprefixerOpts)], sourceMap: true };

module.exports = Object.keys(languages).map(function(language) {
	return {
		entry: ['babel-polyfill', './index.js'],
		output: {
			path: path.join(__dirname, 'output'),
			filename: `bundle-${language}.js`,
		},
		stats: {
			children: false, // Hushes some of the output from the build process, can be safely removed
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
				},
				{
					test: /\.(jpg|jpeg|gif|png)$/,
					loader: 'url-loader?limit=1000&name=[path][name].[hash].[ext]',
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
			new webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {                        
				if (!/\/moment\b/.test(context.context)) { return }                                    

				Object.assign(context, { // context needs to be modified in place                      
					// by default this loads ./.* from locale/, but we only want the languages we use    
					// en-us is the default and is automatically included                                
					regExp: /^\.\/(de|es|fr|hy-am|ja|ru)\./,                                             
				})                                                                                     
			}),                                                                                      
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: { warnings: false },
			}),
			new webpack.DefinePlugin({
				'process.env': { NODE_ENV: JSON.stringify('production') }
			})
		],
		devtool: 'inline-source-map',
	}
})
