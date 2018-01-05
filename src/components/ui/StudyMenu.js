import $ from 'jquery';
import { CIQ } from '../../../js/chartiq';
import Helper from './Helper';

/**
 * UI helper for StudyMenu UI element.
 * @param {HTMLElement} node The node where the study menu will be drawn
 * @param {CIQ.UI.Context} context The context
 * @param {Object} params Optional parameters to control behavior of the menu
 * @param {Object} [params.excludedStudies] A map of study names that should not be put in the menu.
 * @param {Boolean} [params.alwaysDisplayDialog=false] If set to true then, the study will automatically be added to the chart, but a dialog will also always be displayed to allow the end user to pick their study parameters. Otherwise the study will be created automatically with defaults. Can optionally be an object containing a map of which studys to always display the dialog for.
 * @param {Boolean} [params.dialogBeforeAddingStudy=false] If set to true then a dialog will be displayed before the study is added to the chart. This can optionally be a map of which studies require a dialog before adding.
 * @param {string} [params.template=".stxTemplate"] Optionally specify a selector to use as a template for making the menu
 * @name CIQ.UI.StudyMenu
 * @constructor
 */
class StudyMenu extends Helper {
    constructor(node, context, params) {
        super(node, context, params);
        this.node = $(node);
        this.context = context;
        this.params = params || {};
        if (!this.params.template) this.params.template = '.stxTemplate';
        this.params.template = this.node.find(this.params.template);
        this.params.template.detach();
        this.alwaysDisplayDialog = this.params.alwaysDisplayDialog ? this.params.alwaysDisplayDialog : false;
        this.excludedStudies = this.params.excludedStudies;
        if (!this.excludedStudies) this.excludedStudies = [];
        context.advertiseAs(this, 'StudyMenu');
    }

    /**
     * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
     * CIQ.UI.StudyMenu for processing stxtap attributes, or you can call renderMenu() to automatically
     * generate the menu.
     * @memberOf CIQ.UI.StudyMenu
     */
    renderMenu() {
        let stx = this.context.stx;
        let alphabetized = [];
        let sd;
        for (let field of Object.keys(CIQ.Studies.studyLibrary)) {
            sd = CIQ.Studies.studyLibrary[field];
            if (!sd.name) sd.name = field; // Make sure there's always a name
            if (this.excludedStudies[field] || this.excludedStudies[sd.name]) continue;
            alphabetized.push(field);
        }
        alphabetized.sort((lhs, rhs) => {
            let lsd = CIQ.Studies.studyLibrary[lhs];
            let rsd = CIQ.Studies.studyLibrary[rhs];
            if (lsd.name < rsd.name) return -1;
            if (lsd.name > rsd.name) return 1;
            return 0;
        });
        let menu = $(this.node);
        let self = this;
        let tapFn = function (studyName) {
            return function (e) {
                self.pickStudy(e.target, studyName);
                menu.resize();
            };
        };
        for (let i = 0; i < alphabetized.length; i++) {
            let menuItem = this.params.template.clone();
            sd = CIQ.Studies.studyLibrary[alphabetized[i]];
            menuItem.append(CIQ.translatableTextNode(stx, sd.name));
            menu.append(menuItem);
            menuItem[0].selectFC = tapFn(alphabetized[i], this.context);
            menuItem.stxtap(menuItem[0].selectFC);
        }
    }

    /**
     * Pops up a study dialog for the given study
     * @memberof CIQ.UI.StudyMenu
     */
    studyDialog(params) {
        params.context = this.context;
        $('cq-study-dialog').each(function () {
            this.open(params);
        });
    }

    /**
     * Called when the user clicks on a study in the study menu. Depending on the state of
     * this.alwaysDisplayDialog, this will either create a study dialog or it will create the study itself.
     * @param  {HTMLElement} node      The node that was clicked on
     * @param  {string} studyName The name of the study (entry in studyLibrary)
     * @memberOf CIQ.UI.StudyMenu
     */
    pickStudy(node, studyName) {
        let stx = this.context.stx;
        let self = this;

        function handleSpecialCase(flag, params) {
            if (flag === true) {
                self.studyDialog(params);
                return true;
            } else if (typeof flag === 'object') {
                Object.keys(flag).forEach((val, i) => {
                    if (i === studyName && flag[i]) {
                        self.studyDialog(params);
                        return true;
                    }
                });
            }
        }

        if (handleSpecialCase(this.params.dialogBeforeAddingStudy, { stx, name: studyName })) return;
        let sd = CIQ.Studies.addStudy(stx, studyName);
        handleSpecialCase(this.alwaysDisplayDialog, { sd, stx });
    }
}

export default StudyMenu;
