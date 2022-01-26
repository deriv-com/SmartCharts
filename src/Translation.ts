const lang_map: {
    [key: string]: Record<string, string>;
} = {};

export class Translation {
    lang: string;
    constructor(lang = 'en') {
        this.lang = lang;
    }

    setLanguage(lang: string, callback: () => void) {
        if (lang_map[lang] || lang === 'en') {
            this.lang = lang;
            callback?.();
        } else {
            import(/* webpackChunkName: "[request]" */ `../translation/${lang}.json`).then(imported_lang => {
                if (imported_lang) {
                    lang_map[lang] = imported_lang.default;
                    this.lang = lang;
                    callback?.();
                } else {
                    console.error('Unsupported language:', lang);
                }
            });
        }
    }

    /**
     *
     * @param {*} args include string to be translated, its plural form,
     * and object containing key value pair for replacement in translated string.
     *
     * For eg: translate('_n Hour','_n Hours',{'_n':2})
     * Note: The first key-value pair will be used to determine the plural form.
     *
     */
    translate(...args: [string, Record<string, string>]) {
        const curr_lang = lang_map[this.lang];
        const key = args[0].trim();
        const key_with_quotation = key.replace(/"/gi, '\\"'); /* eslint-disable-line */
        let translated = key;
        let has_quotation = false;

        if (curr_lang && curr_lang[key]) {
            translated = curr_lang[key];
        } else if (curr_lang && curr_lang[key_with_quotation]) {
            translated = curr_lang[key_with_quotation];
            has_quotation = true;
        }

        if (args[1]) {
            Object.keys(args[1]).forEach(prop => {
                translated = translated.replace(`[${prop}]`, args[1][prop]);
            });
        }
        return has_quotation ? translated.replace(/\\\"/gi, '"') : translated; /* eslint-disable-line */
    }
}

const trans = new Translation();
export const t = trans;
