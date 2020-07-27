const md5File = require('md5-file');
const fs = require('fs');

const HASH_LENGTH = 8;

let html = fs.readFileSync('index.html', 'utf-8');
const files = html.match(/(\.\/dist\/[a-zA-Z.-]+)/g);
files.forEach((filePath) => {
    const hash = md5File.sync(filePath).substring(0, HASH_LENGTH);
    const newFilePath = filePath.replace('.css', `-${hash}.css`).replace('.js', `-${hash}.js`)
    fs.renameSync(filePath, newFilePath);
    html = html.replace(filePath, newFilePath);
});

fs.writeFileSync('index.html', html, 'utf-8');
