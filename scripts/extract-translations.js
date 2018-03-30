var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var esprima = require('esprima');
var estree = require('estree-utils');
var mkdirp = require('mkdirp');

var file_removed = false;
var string_map = {};
var default_options = {
    method_names: ['translate']
};

var parseCode = (source) => {
    return esprima.parse(source, {
        ecmaVersion: 9,
        sourceType: 'script',
        tolerant: true,
        loc: true
    })['body'];
};

function esc(s) {
    if (!s) return s;
    return s.replace(/"/g, '\\"');
}

var extractTextFromFunctions = (...args) => (code_obj) => {
    const textFunctions = estree.filterTreeForMethodsAndFunctionsNamed(...args)(code_obj);
    return _.map(textFunctions, (node) => {
        var strings = node.arguments.slice(0, 2).map((arg) => arg.value);
        if (!strings[0]) return; // ignore invalid strings
        return {
            text: esc(strings[0]),
            pluralForm: esc(strings[1]),
            loc: {
                line: node.loc.start.line,
                column: node.loc.start.column
            }
        };
    });
};

var formatText = (extracted_obj) => {
    var body = '';
    _.forEach(extracted_obj, (info) => {
        if (!info || string_map[info.text]) {
            return;
        }
        body = body ? `${body}\n` : '';
        body += `${'msgid' + ' "'}${info.text}"\n`;
        if (info.pluralForm) {
            body += `${'msgid_plural' + ' "'}${info.pluralForm}"\n`;
            body += 'msgstr[0] ""\n';
            body += 'msgstr[1] ""\n';
            string_map[info.text] = true;
            return;
        }
        body += 'msgstr ""\n';
        string_map[info.text] = true;
    });
    return body;
};

function getIndicatorStrings() {
    const s = fs.readFileSync(path.resolve('scripts/static-messages.txt')).toString().split('\n');
    let result = [];
    for (const text of s) {
        if (!text || text === '') continue;
        result.push({ text });
    }
    return result;
}

function extractOutPot(source, translationDir) {
    default_options.output = translationDir;
    var options = _.find(this.loaders, loader => loader.path.indexOf("textExtractor") !== -1);
    options = options ? options.options : default_options;
    var output = options.output;
    var parsed_code = parseCode(source);
    var extracted_text = extractTextFromFunctions(...options.method_names)(parsed_code);
    var indicator_text = getIndicatorStrings();
    var formatted_text = `\n${formatText(extracted_text)}`;
    formatted_text += `\n\n# Indicator strings:\n\n${formatText(indicator_text)}`
    try {
        if (file_removed)
        {fs.appendFileSync(`${output}/messages.pot`, formatted_text);}
        else {
            fs.unlinkSync(`${output}/messages.pot`);
            fs.writeFileSync(`${output}/messages.pot`, formatted_text);
            file_removed = true;
        }
    } catch (err) {
        file_removed = true;
        mkdirp.sync(path.resolve(output));
        fs.writeFileSync(`${output}/messages.pot`, formatted_text);
    }
}

const jsFile = process.argv[2];
if (jsFile) {
    console.log('Extracting translations from', jsFile, '...');
    const s = fs.readFileSync(jsFile).toString();
    extractOutPot(s, './translation/');
    console.log('SUCCESS! Translations have been extracted to translations/messages.pot');
} else {
    console.error('Please provide the transpiled js file!');
}


