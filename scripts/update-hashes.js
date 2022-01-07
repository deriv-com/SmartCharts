const md5File = require('md5-file');
const fs = require('fs');

const HASH_LENGTH = 8;

let html = fs.readFileSync('index.html', 'utf-8');
const files = html.match(/(\.\/dist\/[a-zA-Z-]+\.[a-zA-Z-.]+)/g);
files.forEach(file => {
    const hash = md5File.sync(file).substring(0, HASH_LENGTH);
    html = html.replace(file, 'PLACEHOLDER');
    html = html.replace(/PLACEHOLDER[^"]*/, `${file}?${hash}`);
});

fs.writeFileSync('index.html', html, 'utf-8');
