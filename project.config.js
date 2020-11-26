const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
    env: NODE_ENV,
    basePath: __dirname,
    srcDir: 'src',
    outDir: 'dist',
    // publicPath: 'http://localhost:8003/dist/',
    publicPath: './',
    externals: {},
    eslint: false
}
