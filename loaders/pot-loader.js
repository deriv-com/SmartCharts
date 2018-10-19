function PotLoader(source) {
    const js = JSON.parse(source.substring(17));
    let i = 0;
    for (const translation in js) {
        js[translation] = i;
        ++i;
    }
    return `module.exports = ${JSON.stringify(js)}`;
}

module.exports = PotLoader;
