const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    devtool: 'source-map',
    entry: ['babel-polyfill', path.resolve(__dirname, './src/index.js')],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'binarychartiq.js',
        libraryExport: 'default',
        library: 'BinaryChartiq',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
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
            {
                test: /\.(png|cur|jp(e*)g|svg)$/,
                use: [
                    'url-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        },
                    }],
            },
            { parser: { amd: false } },
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    /node_modules/,
                    /chartiq\//,
                    /src\/components\//,
                ],
                loader: 'eslint-loader',
                enforce: 'pre',
                options: { fix: true },
            },
            {
                test: /\.(js|jsx)$/,
                loader: './custom_loader/textExtractor',
                exclude: /node_modules/,
                options: {
                    output: path.resolve(__dirname, 'translation'),
                    method_names: ['translate']
                },
            },
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
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
        new CopyWebpackPlugin([
            { from: './chartiq/chartiq.js' },
        ]),
        new CopyWebpackPlugin([
            { from: './chartiq/splines.js' },
        ]),
        new CopyWebpackPlugin([
            { from: './sass/favicons/*.png' },
        ]),
    ],
    externals: {
        jquery: 'jQuery',
        chartiq: 'CIQ',
    },
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),);
}

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
