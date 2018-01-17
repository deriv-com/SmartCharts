const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    devtool: 'source-map',
    entry: ['babel-polyfill', './src/index.jsx'],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'sass-loader' },
                    ],
                })),
            },
            {
                test: /\.(png|cur|jp(e*)g|svg)$/,
                use: ['url-loader'],
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
        new ExtractTextPlugin({
            filename: 'binarychartiq.css',
        }),
    ],
    externals: {
        jquery: 'jQuery',
    },
};

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
