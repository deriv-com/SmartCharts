var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var esprima = require('esprima');
var estree = require('estree-utils');
var mkdirp = require('mkdirp');

var file_removed = false;
var string_map = {};
var default_options = {
    lang: ['de', 'en', 'es', 'fr', 'id', 'it', 'ja', 'pl', 'pt', 'ru', 'th', 'vi', 'zh_cn', 'zh_tw'],
    method_names: ['translate']
};

var parseCode = (source) => {
    return esprima.parse(source, {
        ecmaVersion: 9,
        sourceType: 'script',
        tolerant: true,
        loc: true
    })['body'];
}

var extractTextFromFunctions = (...args) => (code_obj) => {
    const textFunctions = estree.filterTreeForMethodsAndFunctionsNamed(...args)(code_obj);
    return _.map(textFunctions, (node) => {
        var strings = node.arguments.slice(0, 2).map((arg) => arg.value);
        return {
            text: strings[0],
            pluralForm: strings[1],
            loc: {
                line: node.loc.start.line,
                column: node.loc.start.column
            }
        };
    })
}

var formatText = (extracted_obj) => {
    var fileInfo = extracted_obj.path;
    var body = '';
    _.forEach(extracted_obj, (info) => {
        if (string_map[info.text]) {
            return;
        }
        body = body ? body + '\n' : '';
        body += '#' + fileInfo + ' ' + info.loc.line + ':' + info.loc.column + '\n';
        body += 'msgid' + ' "' + info.text + '"\n';
        if (info.pluralForm) {
            body += 'msgid_plural' + ' "' + info.pluralForm + '"\n';
            body += 'msgstr[0] ""\n';
            body += 'msgstr[1] ""\n';
            string_map[info.text] = true;
            return;
        }
        body += 'msgstr ""\n';
        string_map[info.text] = true;
    });
    return body;
}

var getFilePath = (request, pwd) => {
    var absolute_path = _.last(request.split('!'));
    return absolute_path.replace(pwd, '');
}

module.exports = function (source, map) {
    var root = process.env.PWD;
    default_options.output = path.resolve(root, 'translation');
    var options = _.find(this.loaders, loader => loader.path.indexOf("textExtractor") !== -1)
    options = options ? options.options : default_options;
    var output = options.output;
    var parsed_code = parseCode(source);
    var extracted_text = extractTextFromFunctions(...options.method_names)(parsed_code);
    extracted_text.path = getFilePath(this.request, root);
    var formatted_text = '\n' + formatText(extracted_text);
    try {
        if (file_removed)
            fs.appendFileSync(output + '/messages.pot', formatted_text);
        else {
            fs.unlinkSync(output + '/messages.pot');
            fs.writeFileSync(output + '/messages.pot', formatted_text);
            file_removed = true
        }
    } catch (err) {
        file_removed = true;
        mkdirp.sync(path.resolve(output));
        fs.writeFileSync(output + '/messages.pot', formatted_text);
    }

    return source;
}
