const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: './index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
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
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                },
                warning: "verbose",
                ecma: 6,
                beautify: false,
                comments: false,
                mangle: false,
                toplevel: false,
                keep_classnames: true,
                keep_fnames: true
            },
            sourceMap: true,
            parallel: true
        }),
        // new BundleAnalyzerPlugin()
    ],
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