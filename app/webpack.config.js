const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    devtool: 'source-map',
    entry: ['babel-polyfill', './index.jsx'],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, minimize: true },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './node_modules/@binary-com/smartcharts/dist/chartiq.min.js' },
            { from: './node_modules/@binary-com/smartcharts/dist/smartcharts.css' },
        ]),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
    ],
    externals: {
        CIQ: 'CIQ',
    },
    // query: {
    //     presets: ['es2015', 'react'],
    //     plugins: ['transform-decorators-legacy', 'transform-class-properties']
    //   },
};

module.exports = config;
