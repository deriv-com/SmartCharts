var loaderUtils = require('loader-utils');

function ExcludeBlockLoader(content) {
    var options = loaderUtils.getOptions(this) || {};
    if (!options.start || !options.end) {
        throw new Error('Start and end options are required!');
    }
    var regexPattern = new RegExp(
        '[\\t ]*\\/\\* ?' + options.start + ' ?\\*\\/[\\s\\S]*?\\/\\* ?' + options.end + ' ?\\*\\/[\\t ]*\\n?',
        'g'
    );
    content = content.replace(regexPattern, '');
    return content;
}

module.exports = ExcludeBlockLoader;
