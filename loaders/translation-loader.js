// Extract out only the translations into an array
// TODO: Plural translations not supported!!
function translationLoader(source) {
    const js = JSON.parse(source.substring(17));
    delete js[''];
    const po = Object.values(js).map(a => a[1]);
    return `module.exports = ${JSON.stringify(po)}`;
}

module.exports = translationLoader;
