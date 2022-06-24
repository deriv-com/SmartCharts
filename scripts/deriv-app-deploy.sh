mkdir SmartCharts && find ./ -and -not -path './SmartCharts*' -and -not -path './.git*' -exec mv {} ./SmartCharts \;
git clone https://github.com/binary-com/deriv-app.git
cd deriv-app && npm run bootstrap && rm -rf node_modules/@deriv/deriv-charts/dist
cd ../SmartCharts && npm run build -- --output-path "../deriv-app/node_modules/@deriv/deriv-charts/dist"
cd deriv-app && npm run build:prod
