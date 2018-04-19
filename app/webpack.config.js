const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    devtool: 'source-map',
    entry: './index.jsx',
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
                options: { presets: ['env', 'react'] },
            },
            {
                test: /\.(s*)css$/,
                use: [{
                    loader: 'css-loader',
                    options: { sourceMap: true, minimize: true }
                }, {
                    loader: 'sass-loader',
                    options: { sourceMap: true }
                }],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './node_modules/@binary-com/smartcharts/dist/chartiq.min.js' },
            { from: './node_modules/@binary-com/smartcharts/dist/smartcharts.css' },
        ])
    ],
    externals: {
        jquery: 'jQuery',
        CIQ: 'CIQ',
    },
};

module.exports = config;
