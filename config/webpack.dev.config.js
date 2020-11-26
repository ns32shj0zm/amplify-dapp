/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')
const project = require('../project.config')
const path = require('path')

const development = {
    entry: {
        main: ['webpack-hot-middleware/client?path=./__webpack_hmr']
    },
    output: {
        filename: 'js/[name].js'
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [new WebpackBar(), new webpack.NoEmitOnErrorsPlugin(), new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()]
}

module.exports = merge(base, development)
