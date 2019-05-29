const path = require('path')
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	context: resolve('./'),
	entry: './src/index.js',
	output: {
		path: resolve('dist'),
		filename: 'qweb.js',
		library: 'QWeb',
		libraryTarget: 'umd',
		umdNamedDefine: true,
		libraryExport: "default",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
          configFile: resolve('babel.config.js')
        },
				include: [resolve('src'), resolve('test'), resolve('node_modules/js-amino/src')],
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
	}
}