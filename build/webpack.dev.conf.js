'use strict'

const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',
    // cheap-module-eval-source-map is faster for development
    devtool: 'source-map',

})

module.exports = devWebpackConfig