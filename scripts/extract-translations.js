const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const esprima = require('esprima');
const estree = require('estree-utils');
const mkdirp = require('mkdirp');

let file_removed = false;
const string_map = {};
const default_options = {
    method_names: ['translate'],
};

const parseCode = source => esprima.parse(source, {
    ecmaVersion: 9,
    sourceType: 'script',
    tolerant: true,
    loc: true,
}).body;

function esc(s) {
    if (!s) return s;
    return s.replace(/"/g, '\\"');
}

const extractTextFromFunctions = (...args) => (code_obj) => {
    const textFunctions = estree.filterTreeForMethodsAndFunctionsNamed(...args)(code_obj);
    return _.map(textFunctions, (node) => {
        const strings = node.arguments.slice(0, 2).map(arg => arg.value);
        if (!strings[0]) return; // ignore invalid strings
        return {
            text: esc(strings[0]),
            pluralForm: esc(strings[1]),
            loc: {
                line: node.loc.start.line,
                column: node.loc.start.column,
            },
        };
    });
};

const formatText = (extracted_obj) => {
    let body = '';
    _.forEach(extracted_obj, (info) => {
        if (!info || string_map[info.text]) {
            return;
        }
        body = body ? `${body}\n` : '';
        body += `${'msgid "'}${info.text}"\n`;
        if (info.pluralForm) {
            body += `${'msgid_plural "'}${info.pluralForm}"\n`;
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
    const result = [];
    for (const text of s) {
        if (!text || text === '') continue;
        result.push({ text });
    }
    return result;
}

function extractOutPot(source, translationDir) {
    default_options.output = translationDir;
    let options = _.find(this.loaders, loader => loader.path.indexOf('textExtractor') !== -1);
    options = options ? options.options : default_options;
    const output = options.output;
    const parsed_code = parseCode(source);
    const extracted_text = extractTextFromFunctions(...options.method_names)(parsed_code);
    const indicator_text = getIndicatorStrings();
    let formatted_text = `\n${formatText(extracted_text)}`;
    formatted_text += `\n\n# Indicator strings:\n\n${formatText(indicator_text)}`;
    try {
        if (file_removed) { fs.appendFileSync(`${output}/messages.pot`, formatted_text); } else {
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

