#!/bin/bash
set -e

rm -fR dist # Clear dist, just in case

if [ "$TRAVIS_BRANCH" = "master" ]; then
    # When deploying to production, take beta folder out, remove the dist directory,
    # build, then place the beta folder into dist
    git clone --branch gh-pages https://github.com/$TRAVIS_REPO_SLUG dist --depth 1
    rm -fR beta # Make sure there's no beta folder first
    if [ -d dist/beta ]; then
        mv dist/beta .
    fi
    rm -fR dist
    yarn build
    if [ -d beta ]; then
        mv beta dist/
    fi
    echo 'charts.binary.com' > dist/CNAME
fi

if [ "$TRAVIS_BRANCH" = "dev" ]; then
    # When deploying to beta, build, then rename dist folder to beta, then replace the beta
    # folder in gh-pages with this new beta folder.
    yarn build
    mv dist beta
    git clone --branch gh-pages https://github.com/$TRAVIS_REPO_SLUG dist --depth 1
    rm -fR dist/beta
    mv beta dist/
fi

echo "The following files and folders will be deployed:"
ls -lhSsR dist
