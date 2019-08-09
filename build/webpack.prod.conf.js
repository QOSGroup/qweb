'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development', // production
    devtool: '#source-map',
    plugins: [
        // new BundleAnalyzerPlugin()
    ],
})

module.exports = webpackConfig
