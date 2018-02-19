const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    devtool: 'source-map',
    entry: './index.js',
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: { presets: ['env'] },
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: '../dist/*' },
        ])
    ],
    externals: {
        jquery: 'jQuery',
        CIQ: 'CIQ',
    },
};

module.exports = config;
