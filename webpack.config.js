const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
    devtool: 'source-map',
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            test: /\.svg/,
            use: {
                loader: 'svg-url-loader',
            },
        },
        {
            test: [/\.(scss|css)$/],
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        },
        {
            test: /\.(jpe?g|png|cur|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'base64-inline-loader',
        },
        { parser: { amd: false } },
        {
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /plugins\//,
                /js\//,
                /src\/components\//,
            ],
            loader: 'eslint-loader',
            enforce: 'pre',
            options: { fix: true },
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },
        {
            test: /\.html/,
            use: 'raw-loader',
        },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
        // new webpack.optimize.UglifyJsPlugin(),
    ],
};

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}


module.exports = config;
