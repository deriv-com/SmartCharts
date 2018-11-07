var loaderUtils = require("loader-utils");

function ExcludeBlockLoader(content) {
    var options = loaderUtils.getOptions(this) || {};
    var startComment = options.start || '@if BUILD_MODE=\'lib\'';
    var endComment = options.end || '@endif';
    
    var regexPattern = new RegExp("[\\t ]*\\/\\* ?" + startComment + " ?\\*\\/[\\s\\S]*?\\/\\* ?" + endComment + " ?\\*\\/[\\t ]*\\n?", "g");
    content = content.replace(regexPattern, '');
    return content;
}

module.exports = ExcludeBlockLoader;
