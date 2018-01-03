const webpack = require('webpack');
const path = require('path');

const config = {
    entry: './src/index.js',
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { parser: { amd: false } },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-class-properties'],
                        }
                    }
            },
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /js\/chartiq\.js/,
                    /js\/components\.js/,
                    /js\/componentUI\.js/,
                    /js\/extras/,
                    /js\/thirdparty/,
                    /js\/legacy/
                ],
                use: { loader: 'eslint-loader' }
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
        // new webpack.optimize.UglifyJsPlugin(),
    ]
};

module.exports = config;
