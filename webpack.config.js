const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    devtool: 'source-map',
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            /** SCSS compilation *
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader'
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                // minimize: true,
                                url: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                    ]
                })
            },
*/
            { parser: { amd: false } },
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /src\/components\/components\.js/,
                    /src\/components\/componentUI\.js/,
                    /js/,
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
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '../css/chartiq.css',
        }),
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
        // new webpack.optimize.UglifyJsPlugin(),
    ],
};

module.exports = config;
