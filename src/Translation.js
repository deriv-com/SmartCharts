const lang_map = {};

export class Translation {
    constructor(lang = 'en') {
        this.lang = lang;
    }

    setLanguage(lang) {
        if (lang_map[lang] || lang === 'en') {
            this.lang = lang;
        } else {
            import(/* webpackChunkName: "[request]" */ `../translation/${lang}.json`)
                .then((imported_lang) => {
                    if (imported_lang) {
                        lang_map[lang] = imported_lang.default;
                        this.lang = lang;
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
    translate(...args) {
        const curr_lang = lang_map[this.lang];
        const key = args[0].trim();
        let translated = curr_lang ? (curr_lang[key] || key) : key;
        if (args[1]) {
            Object.keys(args[1]).forEach((prop) => {
                translated = translated.replace(`[${prop}]`, args[1][prop]);
            });
        }
        return translated;
    }
}

const trans = new Translation();
export const t = trans;
