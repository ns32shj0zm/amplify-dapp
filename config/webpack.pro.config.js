/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const base = require('./webpack.base.config')
const project = require('../project.config')

const production = {
    output: {
        filename: 'js/[name].[chunkhash:5].js'
    },
    mode: 'production',
    devtool: false,
    optimization: {
        usedExports: true,
        sideEffects: false,
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: 'runtime'
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                // parallel: true,
                sourceMap: false,
                terserOptions: {
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ]
    },
    resolve: {
        // other configs
        // alias:{
        //   "@ant-design/icons":"purched-antd-icons"
        // }
    },
    plugins: [
        new WebpackBar(),
        new webpack.optimize.ModuleConcatenationPlugin(), // Scope Hoisting
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
        new MiniCssExtractPlugin({
            filename: 'main.[chunkhash:5].css',
            chunkFilename: 'main.[contenthash:5].css' // 多加目录的话，待 CDN 部署时测试
            // filename: 'main.[chunkhash:5].css',
            // chunkFilename: 'main.[contenthash:5].css'
        }),
        new webpack.DllReferencePlugin({
            context: project.basePath,
            manifest: path.resolve(project.basePath, 'dll', 'manifest.json')
        }),
        new HtmlWebpackTagsPlugin({
            tags: [{ path: 'dll', glob: '*.js', globPath: 'dll' }],
            append: false
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(project.basePath, 'dll'),
                    to: path.join(project.basePath, 'dist', 'dll')
                },
                {
                    from: path.join(project.basePath, 'public/static'),
                    to: path.join(project.basePath, 'dist')
                }
            ]
        })
    ]
}

if (process.env.npm_config_argv.includes('--report')) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    production.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = merge(base, production)
