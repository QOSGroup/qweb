// tslint:disable

const path = require('path');

function resolve(filepath) {
	return path.resolve(__dirname, filepath)
}

module.exports = {
	resolve: {
		extensions: ['.js', '.ts', '.json'],
	},
	devtool: 'source-map',// 打包出的js文件是否生成map文件（方便浏览器调试）
	mode: 'production',
	entry: {
		"index": './src/index.ts',
	},
	output: {
		filename: 'qweb.js',// 生成的fiename需要与package.json中的main一致
		path: path.resolve(__dirname, 'build/umd'),
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	performance: {
		hints: false
	},
	module: {
		unknownContextCritical: false,
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							// 指定特定的ts编译配置，为了区分脚本的ts配置
							configFile: path.resolve(__dirname, './tsconfig.module.umd.json'),
						},
					}
				],
				exclude: /node_modules/,
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
	plugins: [],
	node: {
		fs: 'empty'
	}
};