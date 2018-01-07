import { CIQ } from '../../js/chartiq';
import DialogContentTag from './ui/DialogContentTag';

/**
 * Language Dialog web component `<cq-language-dialog>`. This creates a dialog that the user can use to change the language.
 *
 * The actual language choices are obtained from {@link CIQ.I18N.languages}. Choosing a different language causes the entire
 * UI to be translated through use of the {@link CIQ.I18N.setLanguage} method.
 *
 * @namespace WebComponents.cq-language-dialog
 * @since
 * <br>&bull; 4.0.0 New component added added.
 * <br>&bull; 4.1.0 now it calls {@link CIQ.I18N.localize} instead of {@link CIQ.I18N.setLocale}
 * @example
 <cq-dialog>
     <cq-language-dialog>
     </cq-language-dialog>
 </cq-dialog>
 */
class LanguageDialog extends DialogContentTag {
    /**
     * Opens the nearest {@link WebComponents.cq-dialog} to display your dialog.
     * @alias open
     * @memberof WebComponents.cq-share-dialog
     * @since 4.0.0
     */
    open(params) {
        super.open(arguments);
        let cqLanguages = this.node.find('cq-languages');
        cqLanguages.emptyExceptTemplate();
        let template = this.node.find('template');
        let languages = CIQ.I18N.languages;
        if (!languages) return;

        function switchToLanguage(langCode) {
            return function () {
                CIQ.UI.contextsForEach(function () {
                    let stx = this.stx;
                    stx.preferences.language = langCode;
                    stx.changeOccurred('preferences');
                    CIQ.I18N.localize(stx, langCode);
                    stx.draw();
                });
            };
        }
        for (let langCode in languages) {
            let node = CIQ.UI.makeFromTemplate(template, cqLanguages);
            node.find('cq-language-name').text(languages[langCode]);
            node.find('cq-flag').attr('cq-lang', langCode);
            node.stxtap(switchToLanguage(langCode));
        }
    }

    /**
     * Closes dialog box
     * @alias close
     * @memberof WebComponents.cq-share-dialog
     * @since 4.0.0
     */
    close() {
        $('cq-language-dialog').closest('cq-dialog,cq-menu').each(function () {
            this.close();
        });
    }
}


document.registerElement('cq-language-dialog', LanguageDialog);
export default LanguageDialog;
