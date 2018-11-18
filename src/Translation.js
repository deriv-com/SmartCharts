import messages from '../translation/messages.pot';

const lang_map = {};

export class Translation {
    constructor(lang = 'en') {
        this.lang = lang;
    }

    setLanguage(lang) {
        if (lang_map[lang] || lang === 'en') {
            this.lang = lang;
        } else {
            import(/* webpackChunkName: "[request]" */ `../translation/${lang}.po`)
                .then((imported_lang) => {
                    if (imported_lang) {
                        lang_map[lang] = imported_lang;
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

        if (!curr_lang) {
            return this.replace(args[0], args[1]);
        }

        const str = messages[args[0]];
        let rt_str;

        if (typeof args[1] === 'string') { // Plural conversion
            // TODO: currently there are no plurals in SmartCharts so put this off for now...
            throw new Error('Plural conversion not working!');

            // eslint-disable-next-line no-unreachable
            const replacer = args[2];
            const prop = Object.keys(replacer);
            if (replacer[prop[0]] === 0 || replacer[prop[0]] > 1) {
                if (curr_lang[str] && curr_lang[str][2]) {
                    rt_str = curr_lang[str][2];
                } else {
                    rt_str = curr_lang[str] && curr_lang[str][0] ? curr_lang[str][0] : args[1];
                }
            } else {
                rt_str = curr_lang[str] && curr_lang[str][1] ? curr_lang[str][1] : str;
            }
            // Replace variables in string with values.
            rt_str = this.replace(rt_str, replacer);
        } else {
            rt_str = curr_lang[str];
            // Replace variables in string with values.
            rt_str = this.replace(rt_str, args[1]) || args[0];
        }

        return rt_str;
    }

    replace(str, obj) {
        if (!obj) { return str; }

        const prop = Object.keys(obj);
        while (prop.length) {
            const str_var = prop.shift();
            str = str.replace(`[${str_var}]`, obj[str_var]);
        }
        return str;
    }
}

const trans = new Translation();
export const t = trans;
