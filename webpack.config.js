const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
        rules: [
            {
                test: [/\.(scss|css)$/],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            // minimize: true,
                            url: false,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    ],
                }),
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
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
        // new webpack.optimize.UglifyJsPlugin(),
    ],
};

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}


module.exports = config;
