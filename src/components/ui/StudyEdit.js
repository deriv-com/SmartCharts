import $ from 'jquery';
import CIQ from 'chartiq';
import Helper from './Helper';

/**
 * UI Helper for managing study interaction, editing, deleting etc. It sets up
 * {@link CIQ.ChartEngine.callbacks#studyOverlayEdit} and {@link CIQ.ChartEngine.callbacks#studyPanelEdit} callbacks
 * in order to display a dialog for editing study parameters and a context menu for editing or deleting overlays.
 * @name CIQ.UI.StudyEdit
 * @param {HTMLElement} [node=context.topNode] Automatically attaches to the top node of the context
 * @param {CIQ.UI.Context} context The context for the chart
 * @constructor
 * @since  4.1.0 contextDialog is no longer passed in.
 */

class StudyEdit extends Helper {
    constructor(node, context) {
        super(node, context);
        this.context = context;
        this.node = node || context.topNode;
        this.contextDialog = $('cq-study-context');

        context.advertiseAs(this, 'StudyEdit');
        this.initialize();
    }
    /**
     * Closes Study Edit dialog.
     * @memberof CIQ.UI.StudyEdit
     */
    remove() {
        CIQ.Studies.removeStudy(this.params.stx, this.params.sd);
        this.contextDialog.each(function () {
            this.close();
        });
    }

    /**
     * Proxy for editing a study. Assumes the params for the study have already been set.
     * @memberof CIQ.UI.StudyEdit
     */
    edit() {
        this.contextDialog.each(function () {
            this.close();
        });
        this.editPanel(this.params);
    }

    /**
     * This just finds the StudyDialog web component and proxies the parameters
     * over to it
     * @memberof CIQ.UI.StudyEdit
     * @param  {Object} params Parameters from studyPanelEdit callback
     */
    editPanel(params) {
        params.context = this.context;
        // Make sure we don't open the dialog in the context menu position
        params.x = null;
        params.y = null;
        $('cq-study-dialog').each(function () {
            this.open(params);
        });
    }

    /**
     * Displays the context dialog for studies and saves the parameters for editing
     * @memberof CIQ.UI.StudyEdit
     * @param  {Object} params Parameters from studyOverlayEdit callback
     */
    editOverlay(params) {
        this.params = params;
        params.context = this.context;
        if (params.forceEdit) {
            this.editPanel(params);
        } else {
            this.contextDialog.each(function () {
                params.x = CIQ.ChartEngine.crosshairX;
                params.y = CIQ.ChartEngine.crosshairY;
                this.open(params);
            });
        }
    }

    /**
     * Creates the callbacks for self and the context.
     * @memberof CIQ.UI.StudyEdit
     */
    initialize() {
        let stx = this.context.stx;
        let self = this;

        function closure(fc) {
            return function () {
                fc.apply(self, arguments);
            };
        }
        stx.callbacks.studyOverlayEdit = closure(self.editOverlay);
        stx.callbacks.studyPanelEdit = closure(self.editPanel);
    }
}

export default StudyEdit;
