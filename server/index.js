/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const webpack = require('webpack')
const open = require('open')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('../config/webpack.dev.config')
const compress = require('compression')
const project = require('../project.config')
const app = express()
const compiler = webpack(webpackConfig)
const { createProxyMiddleware } = require('http-proxy-middleware')
const os = require('os').networkInterfaces()
const chalk = require('chalk')
const portfinder = require('portfinder')

portfinder.getPort(
    {
        port: 8000,
        stopPort: 8888
    },
    (err, port) => {
        app.use(compress())
        app.use('/', express.static('./public/static'))

        const devMiddleware = webpackDevMiddleware(compiler, {
            lazy: false,
            headers: { 'Access-Control-Allow-Origin': '*' },
            stats: 'errors-only',
            logLevel: 'error'
        })

        devMiddleware.waitUntilValid(() => {
            function getIP() {
                var interfaces = os
                for (var devName in interfaces) {
                    var iface = interfaces[devName]
                    for (var i = 0; i < iface.length; i++) {
                        var alias = iface[i]
                        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                            return alias.address
                        }
                    }
                }
            }
            console.log('\nApp running at:\n')
            console.log(chalk.green(`- Local:   http://localhost:${port}`))
            console.log(chalk.green(`- Network: http://${getIP()}:${port}\n`))
            open('http://localhost:' + port)
        })

        const hotMiddleware = webpackHotMiddleware(compiler, {
            path: '/__webpack_hmr',
            log: console.log,
            heartbeat: 10 * 1000
        })

        app.use(
            '/admin',
            createProxyMiddleware({
                target: 'http://127.0.0.1:9082',
                changeOrigin: true,
                pathRewrite: {
                    '^/admin': '/admin'
                }
            })
        )

        app.use(devMiddleware)
        app.use(hotMiddleware)
        app.use(express.static(project.basePath))
        app.listen(port, () => {
            console.log('start')
        })
    }
)
