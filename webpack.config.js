const path = require('path')
const I18nPlugin = require('i18n-webpack-plugin')
const webpack = require('webpack')

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
			new webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {                        
				if (!/\/moment\b/.test(context.context)) { return }                                    

				Object.assign(context, { // context needs to be modified in place                      
					// by default this loads ./.* from locale/, but we only want the languages we use    
					// en-us is the default and is automatically included                                
					regExp: /^\.\/(de|es|fr|hy-am|ja|ru)\./,                                             
				})                                                                                     
			}),                                                                                      
		],
	}
})
