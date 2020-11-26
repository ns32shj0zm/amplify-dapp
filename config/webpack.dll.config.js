/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const path = require('path')
const project = require('../project.config')

module.exports = {
    entry: {
        react: ['react', 'react-dom', 'react-router-dom'],
        vendor: ['react-redux', 'redux', 'redux-actions', 'redux-promise', 'react-loadable', 'axios']
    },
    mode: 'production',
    output: {
        path: path.resolve(project.basePath, 'dll'),
        filename: '[name].dll.[hash:5].js',
        library: '[name]_library'
    },
    resolve: {
        alias: {
            // "react": "preact-compat",
            // "react-dom": "preact-compat"
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
        new WebpackBar({
            minimal: false,
            compiledIn: false
        }),
        new webpack.DllPlugin({
            name: '[name]_library',
            path: path.resolve(project.basePath, 'dll', 'manifest.json'),
            context: project.basePath
        })
    ]
}
