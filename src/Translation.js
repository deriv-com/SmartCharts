import de from '../translation/de.po';
import fr from '../translation/fr.po';
import id from '../translation/id.po';
import it from '../translation/it.po';
import ja from '../translation/ja.po';
import nl from '../translation/nl.po';
import pl from '../translation/pl.po';
import pt from '../translation/pt.po';
import ru from '../translation/ru.po';
import th from '../translation/th.po';
import vi from '../translation/vi.po';
import zh_cn from '../translation/zh_cn.po';
import zh_tw from '../translation/zh_tw.po';

const lang_map = {
    en: {}, // default
    de,
    fr,
    id,
    it,
    ja,
    nl,
    pl,
    pt,
    ru,
    th,
    vi,
    zh_cn,
    zh_tw,
};

export class Translation {
    constructor(lang = 'en') {
        this.lang = lang;
    }
    setLanguage(lang) {
        if (lang_map[lang]) {
            this.lang = lang;
        } else {
            console.error('Unsupported language:', lang);
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
        const str = args[0];
        let rt_str;

        if (typeof args[1] === 'string') { // Plural conversion
            const replacer = args[2];
            const prop = Object.keys(replacer);
            if (replacer[prop[0]] == 0 || replacer[prop[0]] > 1) {
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
            rt_str = curr_lang[str] && curr_lang[str][1] ? curr_lang[str][1] : str;
            // Replace variables in string with values.
            rt_str = this.replace(rt_str, args[1]);
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
