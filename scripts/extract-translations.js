const path = require('path');
const fs = require('fs');
const espree = require('espree');
const walk = require('estree-walk');
const mkdirp = require('mkdirp');

let file_removed = false;
const string_map = {};
const default_options = {
    method_names: ['translate'],
};

const parseCode = source => espree.parse(source, {
    ecmaVersion: 10,
    sourceType: 'script',
    tolerant: true,
    loc: true,
}).body;

function esc(s) {
    if (!s) return s;
    return s.replace(/"/g, '\\"');
}

const extractTextFromFunctions = (...method_names) => (parsed_code) => {
    const textFunctions = [];
    walk(parsed_code, {
        CallExpression(node) {
            const property = node.callee.property;
            if (property && method_names.includes(property.name)) {
                const [text, pluralForm] = node.arguments.slice(0, 2).map(a => esc(a.value));
                if (text) {
                    textFunctions.push({ text, pluralForm });
                }
            }
        },
    });
    // have translations in alphabetical order to avoid confusing diffs when code changes
    textFunctions.sort(({ text: a }, { text: b }) => a.localeCompare(b));
    return textFunctions;
};

const formatText = (extracted_obj) => {
    let body = '';
    extracted_obj.forEach((info) => {
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
    const options = { ...default_options, output: translationDir };
    const output = options.output;
    const parsed_code = parseCode(source);
    const extracted_text = extractTextFromFunctions(...options.method_names)(parsed_code);
    const indicator_text = getIndicatorStrings();
    const formatted_json = {};

    // this way, the duplicate items also removed
    extracted_text.map(x => {
        formatted_json[x.text.trim()] = x.text.trim();
    });
    
    const formatted_json_content = JSON.stringify(formatted_json, null, 2);
    try {
        if (file_removed) { fs.appendFileSync(`${output}/messages.json`, formatted_json_content); } else {
            fs.unlinkSync(`${output}/messages.json`);
            fs.writeFileSync(`${output}/messages.json`, 'utf8', formatted_json_content);
            file_removed = true;
        }
    } catch (err) {
        file_removed = true;
        mkdirp.sync(path.resolve(output));
        fs.writeFileSync(`${output}/messages.json`, formatted_json_content);
    }

    return formatted_json;
}

function updateTranslatedFile(filename, source, translated) {

    const new_translated_content = {}

    Object.keys(source).forEach(key=> {
        new_translated_content[key] = translated[key] || '';
    });
    const formatted_json_content = JSON.stringify(new_translated_content, null, 2);

    try {
        fs.unlinkSync(filename);
        fs.writeFileSync(filename, 'utf8', formatted_json_content);
    } catch (err) {
        fs.writeFileSync(filename, formatted_json_content);
    }
    return true;
}

function updateOtherLanguages(source, translationDir) {

    try {
        const filenames = fs.readdirSync(translationDir)
        const validFilenames = (filenames || []).filter(file => (file.split('.').pop() === 'json' && file !== 'messages.json'));

        validFilenames.forEach(filename => {
            const content = fs.readFileSync(translationDir + filename, 'utf-8');
            const translated = JSON.parse(content);
            updateTranslatedFile(translationDir + filename, source, translated);
        });
    } catch (err) {
      console.error('ERROR: problem reading translation direcotry, Perhaps a permission issue exist.')
      console.log(`ERROR: {err}`);
      console.log(err);
    }
}

const jsFile = process.argv[2];
if (jsFile) {
    console.log('Extracting translations from', jsFile, '...');
    const s = fs.readFileSync(jsFile).toString();
    const extracted_text = extractOutPot(s, './translation/');
    console.log('SUCCESS! Translations have been extracted to translations/messages.json');
    
    console.log('Updating other language files.');
    updateOtherLanguages(extracted_text, './translation/');
    console.log('SUCCESS! Updated Other translations files translations/*.json');
} else {
    console.error('Please provide the transpiled js file!');
}
