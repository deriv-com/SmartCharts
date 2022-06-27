npm run build
rm -rf node_modules && rm .*rc *.js *.ts && rm -rf deriv-app
git clone https://github.com/binary-com/deriv-app.git --depth 1
cd deriv-app && npm run bootstrap && rm -rf node_modules/@deriv/deriv-charts/dist && cd ..
cp -R dist deriv-app/node_modules/@deriv/deriv-charts/
cd deriv-app && npm run build:prod
