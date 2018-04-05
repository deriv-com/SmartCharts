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
    yarn build
    mkdir ghpages
    mv dist ghpages/dist
    if [ -d beta ]; then
        mv beta ghpages/beta
    fi
    echo 'charts.binary.com' > ghpages/CNAME
fi

if [ "$TRAVIS_BRANCH" = "dev" ]; then
    # When deploying to beta, build, then rename dist folder to beta, then replace the beta
    # folder in gh-pages with this new beta folder.
    yarn build
    git clone --branch gh-pages https://github.com/$TRAVIS_REPO_SLUG ghpages --depth 1
    rm -fR ghpages/beta
    mkdir ghpages/beta
    mv dist ghpages/beta/dist/
fi

# Do not deploy any other branch aside dev and master
if [ "$TRAVIS_BRANCH" = "dev" ] || [ "$TRAVIS_BRANCH" = "master" ]; then
    # copy over demo css and index.html
    DEPLOY_DIR=ghpages
    if [ "$TRAVIS_BRANCH" = "dev" ]; then
        DEPLOY_DIR=ghpages/beta
    fi
    CSS_DIR="$DEPLOY_DIR/css"
    mkdir "$CSS_DIR"
    cp css/demo.css "$CSS_DIR"
    cp index.html "$DEPLOY_DIR"
fi

echo "The following files and folders will be deployed:"
ls -lhSsR ghpages
