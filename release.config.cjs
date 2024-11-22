const transform = require('./release.utils.cjs');

module.exports = {
    branches: [
        '+([0-9])?(.{+([0-9]),x}).x',
        'master',
        'next',
        'next-major',
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
    ],
    repositoryUrl: 'git@github.com:deriv-com/SmartCharts.git',
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                releaseRules: [
                    {
                        type: 'feat',
                        release: 'minor',
                    },
                    {
                        type: 'build',
                        release: 'patch',
                    },
                    {
                        type: 'ci',
                        release: 'patch',
                    },
                    {
                        type: 'chore',
                        release: 'patch',
                    },
                    {
                        type: 'docs',
                        release: 'patch',
                    },
                    {
                        type: 'refactor',
                        release: 'patch',
                    },
                    {
                        type: 'style',
                        release: 'patch',
                    },
                    {
                        type: 'test',
                        release: 'patch',
                    },
                ],
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                parserOpts: {
                    mergePattern: /^Merge pull request #(\d+) from (.*)$/,
                    mergeCorrespondence: ['id', 'source'],
                },
                writerOpts: { transform },
            },
        ],
        '@semantic-release/changelog',
        [
            '@semantic-release/npm',
            {
                npmPublish: true,
            },
        ],
        '@semantic-release/github',
    ],
};
