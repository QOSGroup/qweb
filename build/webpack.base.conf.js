const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	context: resolve('./'),
	entry: './index.js',
	output: {
		path: resolve('dist'),
		filename: 'qweb.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test'), resolve('node_modules/js-amino'),],
			},
			{
				test: /[\\\/]tweetnacl[\\\/]/,
				use: ['exports-loader', 'imports-loader']
			},
			{
				test: /[\\\/]tweetnacl-auth[\\\/]/,
				use: ['exports-loader', 'imports-loader']
			}
		],
		noParse: [
			/[\\\/]tweetnacl[\\\/]/,
			/[\\\/]tweetnacl-auth[\\\/]/
		]
	},
	node: {
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		setImmediate: false,
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
}