#!/bin/bash
set -e

rm -rf dist
rm -rf .publish
yarn build
mkdir .publish
cp index.html .publish/index.html
mv dist .publish
yarn run-gh-pages
rm -rf .publish
