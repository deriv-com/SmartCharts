const md5File = require('md5-file')
const fs = require('fs');

const files = ['./dist/smartcharts.js', './dist/smartcharts.css', './css/app.css'];

let html = fs.readFileSync('index.html', 'utf-8');
files.forEach(file => {
    const hash = md5File.sync(file);
    html = html.replace(file, 'PLACEHOLDER');
    html = html.replace(/PLACEHOLDER[^"]*/, `${file}?${hash}`);
});

fs.writeFileSync('index.html', html, 'utf-8');
