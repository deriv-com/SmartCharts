var loaderUtils = require("loader-utils");

function ExcludeBlockLoader(content) {
    var options = loaderUtils.getOptions(this) || {};
    var startComment = options.start || '@if NODE_ENV=\'production\'';
    var endComment = options.end || '@endif';

    var regexPattern = new RegExp("[\\t ]*\\/\\* ?" + startComment + " ?\\*\\/[\\s\\S]*?\\/\\* ?" + endComment + " ?\\*\\/[\\t ]*\\n?", "g");
    console.log(regexPattern);
    content = content.replace(regexPattern, '');

    return content;
}

module.exports = ExcludeBlockLoader;
