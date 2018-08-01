#!/bin/bash
set -e

rm -fR ghpages # Clear ghpages, just in case

if [ "$TRAVIS_BRANCH" = "master" ]; then
    # When deploying to production, take beta folder out, remove the dist directory,
    # build, then place the beta folder into dist
    git clone --branch gh-pages https://github.com/$TRAVIS_REPO_SLUG ghpages --depth 1
    rm -fR beta # Make sure there's no beta folder first
    if [ -d ghpages/beta ]; then
        mv ghpages/beta .
    fi
    rm -fR ghpages
    mkdir ghpages
    mv dist ghpages/
    if [ -d beta ]; then
        mv beta ghpages/
    fi
    echo 'charts.binary.com' > ghpages/CNAME
fi

if [ "$TRAVIS_BRANCH" = "dev" ]; then
    # When deploying to beta, build, then rename dist folder to beta, then replace the beta
    # folder in gh-pages with this new beta folder.
    git clone --branch gh-pages https://github.com/$TRAVIS_REPO_SLUG ghpages --depth 1
    rm -fR ghpages/beta
    mkdir ghpages/beta
    mv dist ghpages/beta/
fi

# Do not deploy any other branch aside dev and master
if [ "$TRAVIS_BRANCH" = "dev" ] || [ "$TRAVIS_BRANCH" = "master" ]; then
    # copy over index.html
    DEPLOY_DIR=ghpages
    if [ "$TRAVIS_BRANCH" = "dev" ]; then
        DEPLOY_DIR=ghpages/beta
    fi
    cp index.html "$DEPLOY_DIR"
fi

echo "The following files and folders will be deployed:"
ls -lhSsR ghpages
