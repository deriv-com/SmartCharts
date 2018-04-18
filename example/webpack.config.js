const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    devtool: 'source-map',
    entry: './index.jsx',
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'example-app.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: { presets: ['env', 'react'] },
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: '../dist/chartiq.min.js' },
            { from: '../dist/smartcharts.css' },
        ])
    ],
    externals: {
        jquery: 'jQuery',
        CIQ: 'CIQ',
    },
    resolve: {
        alias: {
            smartcharts: '../dist/smartcharts.js',
        }
    }
};

module.exports = config;
