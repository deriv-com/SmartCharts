// import de from "json-loader!po-loader!../translation/de.po";
// import en from "json-loader!po-loader!../translation/en.po";
// import es from "json-loader!po-loader!../translation/es.po";
// import fr from "json-loader!po-loader!../translation/fr.po";
// import id from "json-loader!po-loader!../translation/id.po";
// import it from "json-loader!po-loader!../translation/it.po";
// import ja from "json-loader!po-loader!../translation/ja.po";
// import pl from "json-loader!po-loader!../translation/pl.po";
// import pt from "json-loader!po-loader!../translation/pt.po";
// import ru from "json-loader!po-loader!../translation/ru.po";
// import th from "json-loader!po-loader!../translation/th.po";
// import vi from "json-loader!po-loader!../translation/vi.po";
// import zh_cn from "json-loader!po-loader!../translation/zh_cn.po";
// import zh_tw from "json-loader!po-loader!../translation/zh_tw.po";
// This is for testing purpose only.
import test from "json-loader!po-loader!../translation/test.po";

const lang_map = {
    // de: de,
    // en: en,
    // es: es,
    // fr: fr,
    // id: id,
    // it: it,
    // ja: ja,
    // pl: pl,
    // pt: pt,
    // ru: ru,
    // th: th,
    // vi: vi,
    // zh_cn: zh_cn,
    // zh_tw: zh_tw,
    test: test,
};

export class Translation {
    constructor(lang) {
        this.lang = lang;
    }
    setLanguage(lang) {
        this.lang = lang;
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
        let curr_lang = lang_map[this.lang];
        if (!curr_lang) curr_lang = lang_map.test;
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
        if (!obj) return str;

        const prop = Object.keys(obj);
        while (prop.length) {
            const str_var = prop.shift();
            str = str.replace('[' + str_var + ']', obj[str_var]);
        }
        return str;
    }
}

var trans = new Translation('en');
export const t = trans;
