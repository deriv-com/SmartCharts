const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: { sourceMap: true, minimize: true }
                    }, {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }],
                })),
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './node_modules/@binary-com/smartcharts/dist/chartiq.min.js' },
            { from: './node_modules/@binary-com/smartcharts/dist/smartcharts.css' },
        ]),
        new ExtractTextPlugin("styles.css"),
    ],
    externals: {
        CIQ: 'CIQ',
    },
};

module.exports = config;
