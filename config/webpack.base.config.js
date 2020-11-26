/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const eslintFormatter = require('eslint-friendly-formatter')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const project = require('../project.config.js')
const isEsLint = project.eslint
const SRC_DIR = path.join(project.basePath, project.srcDir)
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const { TurnedIn } = require('@material-ui/icons')

const isProduction = process.env.NODE_ENV === 'production'

const eslintLoader = () => {
    const loader = [
        {
            test: /(\.jsx|\.js)$/,
            use: {
                loader: 'eslint-loader?cacheDirectory',
                options: {
                    formatter: eslintFormatter
                }
            },
            enforce: 'pre',
            include: SRC_DIR,
            exclude: /node_modules/
        }
    ]
    return isEsLint ? loader : []
}

const fontLoader = () => {
    const font = [
        ['woff', 'application/font-woff'],
        ['woff2', 'application/font-woff2'],
        ['otf', 'font/opentype'],
        ['ttf', 'application/octet-stream'],
        ['eot', 'application/vnd.ms-fontobject']
    ]
    const loader = []
    font.forEach(item => {
        const extension = item[0]
        const mimetype = item[1]
        loader.push({
            test: new RegExp(`\\.${extension}$`),
            loader: 'url-loader',
            options: {
                name: 'fonts/[name].[ext]',
                limit: 10000,
                mimetype
            }
        })
    })
    return loader
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const cssLoader = (type = 'css', options = {}) => {
    const miniCss = isProduction
        ? [
              {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                      publicPath: project.publicPath // 多加目录的话，待 CDN 部署时测试
                  }
              }
          ]
        : []
    const typeReg = {
        css: /\.css$/,
        stylus: /\.(styl|stylus)$/,
        less: /\.less$/,
        sass: /\.(sass|scss)$/
    }
    const typeModuleReg = {
        css: /\.module\.css$/,
        stylus: /\.module\.(styl|stylus)$/,
        less: /\.module\.less$/,
        sass: /\.module\.(sass|scss)$/
    }
    const preParseLoader =
        type === 'css'
            ? []
            : [
                  {
                      loader: `${type}-loader`,
                      options
                  }
              ]
    const loader = [
        {
            test: typeModuleReg[type],
            use: [
                {
                    loader: 'style-loader'
                },
                ...miniCss,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: {
                            getLocalIdent: getCSSModuleLocalIdent
                        }
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                ...preParseLoader
            ]
        },
        {
            test: typeReg[type],
            exclude: typeModuleReg[type],
            use: [
                {
                    loader: 'style-loader'
                },
                ...miniCss,
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader'
                },
                ...preParseLoader
            ]
        }
    ]
    return loader
}

const base = {
    entry: {
        main: [SRC_DIR]
    },
    output: {
        path: path.resolve(project.basePath, project.outDir),
        publicPath: project.publicPath
    },
    resolve: {
        modules: [project.srcDir, 'node_modules'],
        alias: {
            '@': SRC_DIR
            // "react": "preact-compat",
            // "react-dom": "preact-compat"
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    externals: project.externals,
    module: {
        rules: [
            ...cssLoader(),
            ...cssLoader('less', {
                lessOptions: {
                    javascriptEnabled: true
                }
            }),
            ...cssLoader('stylus', {
                import: [path.resolve(__dirname, '../src/assets/stylus/lib/mixin.styl')]
            }),
            ...eslintLoader(),
            ...fontLoader(),
            {
                test: /\.(jsx|tsx|js|ts)$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/
            },
            // {
            //     test: /\.svg$/,
            //     use: 'svg-sprite-loader'
            // },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: {
                    test: /\.jsx|\.tsx?$/
                },
                use: [
                    {
                        loader: '@svgr/webpack'
                    },
                    {
                        loader: 'url-loader'
                    }
                ]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: {
                    test: /\.(styl|less|scss|css)?$/
                },
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },
            {
                test: /.(gif|jpg|jpeg|png)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            esModule: false,
                            limit: 1024,
                            name: 'images/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    performance: {
        hints: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true,
            favicon: path.resolve('public/favicon.ico'),
            minify: {
                collapseWhitespace: true
            },
            chunksSortMode: 'none',
            publicPath: project.publicPath
        }),
        // new PreloadWebpackPlugin(),
        // new HardSourceWebpackPlugin()
        new AntdDayjsWebpackPlugin()
    ]
}

module.exports = base
