module.exports = {
    parser: 'postcss-scss',
    plugins: [
        // eslint-disable-next-line import/no-extraneous-dependencies, global-require
        require('postcss-rtlcss')(),
        {
            'postcss-preset-env': {},
        },
    ],
};
