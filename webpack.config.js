const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
const isApp = process.env.BUILD_MODE === 'app';

const config = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'smartcharts.js',
        libraryExport: 'default',
        library: 'smartcharts',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            data: '@import "sass/_variables.scss";@import "sass/_themes.scss";',
                            includePaths: [
                                path.resolve(__dirname, './src'),
                            ],
                        },
                    }],
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
                    /\\chartiq/,
                    /\\scripts/,
                ],
                loader: 'eslint-loader',
                enforce: 'pre',
                options: { fix: true },
            },
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.po$/,
                loader: 'json-loader!po-loader',
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            t: [path.resolve(__dirname, './src/Translation.js'), 't'],
        }),
        new MiniCssExtractPlugin({ filename: 'smartcharts.css' }),
        new CopyWebpackPlugin([
            { from: './chartiq/chartiq.min.js' },
        ]),
    ],
    externals: {
        chartiq: 'CIQ',
        mobx: 'mobx',
        react: {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            root: 'ReactDOM',
        },
        'mobx-react': {
            commonjs: 'mobx-react',
            commonjs2: 'mobx-react',
            root: 'mobxReact',
        },
        'babel-polyfill': 'babel-polyfill',
    },
};

if (production) {
    config.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }));
}

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}

if (isApp) {
    config.entry = path.resolve(__dirname, './app/index.jsx');
    config.resolve = {
        alias: {
            '@binary-com/smartcharts': path.resolve(__dirname, 'src/'),
        },
    };
    config.plugins.push(new CopyWebpackPlugin([
        { from: './sass/favicons/*.png' },
        { from: './node_modules/babel-polyfill/dist/polyfill.min.js', to: 'babel-polyfill.min.js' },
        {
            from: production ?
                './node_modules/react/umd/react.production.min.js' :
                './node_modules/react/umd/react.development.js',
            to: 'react.js',
        },
        {
            from: production ?
                './node_modules/react-dom/umd/react-dom.production.min.js' :
                './node_modules/react-dom/umd/react-dom.development.js',
            to: 'react-dom.js',
        },
        {
            from: production ?
                './node_modules/mobx/lib/mobx.umd.min.js' :
                './node_modules/mobx/lib/mobx.umd.js',
            to: 'mobx.js',
        },
        {
            from: production ?
                './node_modules/mobx-react/index.min.js' :
                './node_modules/mobx-react/index.js',
            to: 'mobx-react.js',
        },
    ]));
}

module.exports = config;
