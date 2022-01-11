const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
const isApp = process.env.BUILD_MODE === 'app';
const BUILD_MODE = isApp ? process.env.BUILD_MODE : 'lib';
const appEntryFile = isApp && process.env.APP_ENTRY ? process.env.APP_ENTRY : 'index';

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'smartcharts.js',
    chunkFilename: '[name]-[chunkhash:6].smartcharts.js',
    libraryExport: 'default',
    library: 'smartcharts',
    libraryTarget: 'umd',
    hashDigestLength: 6,
};

const config = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, './src/index.ts'),
    output,
    resolve: {
        alias: {
            '@binary-com/smartcharts': path.resolve(__dirname, 'src/'),
            chartiq: path.resolve(__dirname, `chartiq/${production ? 'production' : 'development'}/index.js`),
            src: path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.tsx', '.js'],
    },
    devServer: {
        publicPath: '/dist/',
        writeToDisk: true,
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'sprite-[hash:6].smartcharts.svg',
                            esModule: false,
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [{ removeUselessStrokeAndFill: false }, { removeUnknownsAndDefaults: false }],
                        },
                    },
                ],
            },
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: loader => [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('postcss-preset-env')(),
                                require('postcss-inline-svg'),
                                require('postcss-svgo'),
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            data: '@import "sass/_variables.scss";@import "sass/_themes.scss";',
                            includePaths: [path.resolve(__dirname, './src')],
                        },
                    },
                ],
            },
            { parser: { amd: false } },
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, /\\chartiq/, /\\scripts/],
                loader: 'eslint-loader',
                enforce: 'pre',
                options: { fix: true },
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                // exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.po$/,
                loader: [path.resolve('./loaders/translation-loader.js'), 'json-loader', 'po-loader'],
            },
            {
                test: /\.pot$/,
                loader: [path.resolve('./loaders/pot-loader.js'), 'json-loader', 'po-loader'],
            },
            {
                include: path.resolve(__dirname, 'src/utils/ga.js'),
                use: [
                    {
                        loader: path.resolve('./loaders/exclude-block-loader.js'),
                        options: {
                            start: `@START-EXCLUDE: '${BUILD_MODE}'`,
                            end: '@END-EXCLUDE',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            t: [path.resolve(__dirname, './src/Translation.ts'), 't'],
        }),
        new MiniCssExtractPlugin({ filename: 'smartcharts.css' }),
        new StyleLintPlugin(),
        new SpriteLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin(),
    ],
    externals: {
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
        'babel-polyfill': 'babel-polyfill',
        'react-transition-group': {
            commonjs: 'react-transition-group',
            commonjs2: 'react-transition-group',
            root: 'ReactTransitionGroup',
        },
        moment: {
            root: 'moment',
            commonjs: 'moment',
            commonjs2: 'moment',
        },
    },
};

if (production) {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        })
    );
}

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
}

if (isApp) {
    config.entry = path.resolve(__dirname, `./app/${appEntryFile}.tsx`);
    config.plugins.push(
        new CopyWebpackPlugin({
            patterns: [
                { from: './sass/favicons/*.png' },
                { from: './node_modules/@babel/polyfill/dist/polyfill.min.js', to: 'babel-polyfill.min.js' },
                { from: './app/browser-detection.js' },
                { from: './app/assets/*.svg' },
                { from: './nojs-smartcharts.css' },
                {
                    from: production
                        ? './node_modules/react/umd/react.production.min.js'
                        : './node_modules/react/umd/react.development.js',
                    to: 'react.js',
                },
                {
                    from: production
                        ? './node_modules/react-dom/umd/react-dom.production.min.js'
                        : './node_modules/react-dom/umd/react-dom.development.js',
                    to: 'react-dom.js',
                },
                {
                    from: production
                        ? './node_modules/mobx/lib/mobx.umd.min.js'
                        : './node_modules/mobx/lib/mobx.umd.js',
                    to: 'mobx.js',
                },
                {
                    from: production
                        ? './node_modules/mobx-react-lite/dist/mobxreactlite.umd.production.min.js'
                        : './node_modules/mobx-react-lite/dist/mobxreactlite.umd.development.js',
                    to: 'mobx-react-lite.js',
                },
                {
                    from: production
                        ? './node_modules/moment/min/moment-with-locales.min.js'
                        : './node_modules/moment/min/moment-with-locales.js',
                    to: 'moment.js',
                },
                {
                    from: './node_modules/react-transition-group/dist/react-transition-group.js',
                    to: 'react-transition-group.js',
                },
            ],
        })
    );
}

module.exports = config;
