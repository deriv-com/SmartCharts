import { CIQ } from '../../js/chartiq';
import ModalTag from './ui/ModalTag';

/**
 * Study legend web component `<cq-study-legend>`.
 *
 * Click on the "X" to remove the study.
 * Click on the cog to edit the study.
 * Optionally only show studies needing custom Removal. cq-custom-removal-only
 * Optionally only show overlays. cq-overlays-only
 * Optionally only show studies in this panel. cq-panel-only
 *
 * @namespace WebComponents.cq-study-legend
 * @example
    <caption>
    Here is an example of how to create a study legend on the chart.
    We use the `cq-marker` attribute to ensure that it floats inside the chart.
    We set the optional `cq-panel-only` attribute so that only studies from
    this panel are displayed.
    </caption>
<cq-study-legend cq-marker-label="Studies" cq-overlays-only cq-marker cq-hovershow>
    <template>
        <cq-item>
            <cq-label></cq-label>
            <span class="ciq-edit"></span>
            <div class="ciq-icon ciq-close"></div>
        </cq-item>
    </template>
</cq-study-legend>
     * @example
        <caption>
        Here is an example of how to create a study legend inside a drop down menu.
        We use the `cq-no-close` attribute so that drop down is not closed when the user removes a study from the list.
        </caption>
<cq-menu class="ciq-menu ciq-studies collapse">
    <span>Studies</span>
    <cq-menu-dropdown cq-no-scroll>
        <cq-study-legend cq-no-close>
            <cq-section-dynamic>
                <cq-heading>Current Studies</cq-heading>
                <cq-study-legend-content>
                    <template>
                        <cq-item>
                            <cq-label class="click-to-edit"></cq-label>
                            <div class="ciq-icon ciq-close"></div>
                        </cq-item>
                    </template>
                </cq-study-legend-content>
                <cq-placeholder>
                    <div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
                </cq-placeholder>
            </cq-section-dynamic>
        </cq-study-legend>
        <cq-scroll cq-studies>
            <cq-item class="stxTemplate"></cq-item>
        </cq-scroll>

    </cq-menu-dropdown>
</cq-menu>
 *
 */
class StudyLegend extends ModalTag {
    setContext(context) {
        this.template = this.node.find('template');
        this.previousStudies = {};
        this.begin();
    }

    /**
     * Begins running the StudyLegend.
     * @memberof! WebComponents.cq-study-legend
     * @private
     */
    begin() {
        let self = this;

        function render() {
            self.showHide();
            self.renderLegend();
        }
        this.addInjection('append', 'createDataSet', render);
        render();
    }

    showHide() {
        for (let s in this.context.stx.layout.studies) {
            if (!this.context.stx.layout.studies[s].customLegend) {
                this.node.css({
                    display: '',
                });
                return;
            }
        }
        this.node.css({
            display: 'none',
        });
    }

    /**
     * Renders the legend based on the current studies in the CIQ.ChartEngine object. Since this gets called
     * continually in the draw animation loop we are very careful not to render unnecessarily.
     * @memberof! WebComponents.cq-study-legend
     */
    renderLegend() {
        let stx = this.context.stx;
        if (!stx.layout.studies) return;
        let foundAChange = false;
        let id;

        // Logic to determine if the studies have changed, otherwise don't re-create the legend
        if (CIQ.objLength(this.previousStudies) === CIQ.objLength(stx.layout.studies)) {
            for (id in stx.layout.studies) {
                if (!this.previousStudies[id]) {
                    foundAChange = true;
                    break;
                }
            }
            if (!foundAChange) return;
        }
        this.previousStudies = CIQ.shallowClone(stx.layout.studies);

        $(this.template).parent().emptyExceptTemplate();

        function closeStudy(self, sd) {
            return function (e) {
                // Need to run this in the nextTick because the study legend can be removed by this click
                // causing the underlying chart to receive the mousedown (on IE win7)
                setTimeout(() => {
                    CIQ.Studies.removeStudy(self.context.stx, sd);
                    if (self.node[0].hasAttribute('cq-marker')) self.context.stx.modalEnd();
                    self.renderLegend();
                }, 0);
            };
        }

        function editStudy(self, studyId) {
            return function (e) {
                let sd = stx.layout.studies[studyId];
                if (!sd.editFunction) return;
                e.stopPropagation();
                self.uiManager.closeMenu();
                let studyEdit = self.context.getAdvertised('StudyEdit');
                let params = {
                    stx,
                    sd,
                    inputs: sd.inputs,
                    outputs: sd.outputs,
                    parameters: sd.parameters,
                };
                studyEdit.editPanel(params);
            };
        }
        let overlaysOnly = typeof (this.node.attr('cq-overlays-only')) !== 'undefined';
        let panelOnly = typeof (this.node.attr('cq-panel-only')) !== 'undefined';
        let customRemovalOnly = typeof (this.node.attr('cq-custom-removal-only')) !== 'undefined';
        let holder = this.node.parents('.stx-holder');
        let panelName = null;
        let markerLabel = this.node.attr('cq-marker-label');
        if (holder.length) {
            panelName = holder.attr('cq-panel-name');
        }

        for (id in stx.layout.studies) {
            let sd = stx.layout.studies[id];
            if (sd.customLegend) continue;
            if (customRemovalOnly && !sd.study.customRemoval) continue;
            if (panelOnly && sd.panel !== panelName) continue;
            if (overlaysOnly && !sd.overlay && !sd.underlay) continue;
            let newChild = CIQ.UI.makeFromTemplate(this.template, true);
            newChild.find('cq-label').html(sd.inputs.display);
            let close = newChild.find('.ciq-close');
            if (sd.permanent) {
                close.hide();
            } else {
                close.stxtap(closeStudy(this, sd));
            }
            let edit = newChild.find('.ciq-edit');
            if (!edit.length) edit = newChild.find('cq-label');
            edit.stxtap(editStudy(this, id));
        }
        // Only want to render the marker label if at least one study has been
        // rendered in the legend. If no studies are rendered, only the template tag
        // will be in there.
        if (typeof (markerLabel) !== 'undefined' && this.node[0].childElementCount > 1) {
            this.node.prepend(`<cq-marker-label>${markerLabel}</cq-marker-label>`);
        }
        CIQ.I18N.translateUI(null, this.node[0]);
        // this.context.resize();
        this.showHide();
    }
}

document.registerElement('cq-study-legend', StudyLegend);
export default StudyLegend;
