import $ from 'jquery';
import CIQ from 'chartiq';
import React, { Component } from 'react';
import contextAware from '../contextAware';

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
class StudyLegend extends Component {
    constructor() {
        super();
        this.injections = [];
        this.state = {
            studies: [],
            clearStudies: undefined,
        };
    }

    onContextReady(context) {
        this._context = context;
        this.previousStudies = {};
        this.uiManager = $$$('cq-ui-manager');
        this.begin();
    }

    /**
     * Begins running the StudyLegend.
     * @memberof! WebComponents.cq-study-legend
     * @private
     */
    begin() {
        this.addInjection('append', 'createDataSet', this.renderLegend.bind(this));
        this.renderLegend();
    }

    /**
     * Renders the legend based on the current studies in the CIQ.ChartEngine object. Since this gets called
     * continually in the draw animation loop we are very careful not to render unnecessarily.
     * @memberof! WebComponents.cq-study-legend
     */
    renderLegend() {
        let stx = this._context.stx;
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

        function closeStudy(self, sd) {
            return function (e) {
                // Need to run this in the nextTick because the study legend can be removed by this click
                // causing the underlying chart to receive the mousedown (on IE win7)
                setTimeout(() => {
                    CIQ.Studies.removeStudy(self._context.stx, sd);
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
                let studyEdit = self._context.getAdvertised('StudyEdit');
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

        const studies = [];
        for (const id in stx.layout.studies) {
            let sd = stx.layout.studies[id];
            if (sd.customLegend) continue;

            let closeFunc;
            if (!sd.permanent) {
                closeFunc = closeStudy(this, sd);
            }

            const editFunc = editStudy(this, id);

            studies.push({
                display: sd.inputs.display,
                closeFunc,
                editFunc,
            });
        }

        this.setState({
            studies,
        });
    }

    /**
     *
     * @kind function
     * @memberof CIQ.UI.ContextTag
     * @param {string} position Where in the animation loop the injection should be added. Append or Prepend.
     * @param {string} injection What function to add the injection too
     * @param {function} code The callback to fired when the injection occurs
     */
    addInjection(position, injection, code) {
        this.injections.push(this._context.stx[position](injection, code));
    }

    componentWillUnmount() {
        if (this._context && this.injections) {
            for (const inj of this.injections) {
                this._context.stx.removeInjection(inj);
            }
            this.injections = [];
        }
    }

    clearStudies = () => {
        if (this._context) {
            this._context.advertised.Layout.clearStudies();
        }
    }

    render() {
        const { studies } = this.state;

        return (
            <cq-menu class="ciq-menu ciq-studies collapse">
                <span className="ciq-icon ciq-ic-indicator-normal" />
                <cq-menu-dropdown cq-no-scroll>
                    <cq-study-legend cq-no-close>
                        {studies.length > 0 &&
                            <cq-section-dynamic>
                                <cq-heading>Current Indicators</cq-heading>
                                <cq-study-legend-content>
                                    {studies.map((c, i) =>
                                        <cq-item key={i}>
                                            <cq-label
                                                onClick={c.editFunc}
                                                className="click-to-edit"
                                            >
                                                {c.display}
                                            </cq-label>
                                            <div
                                                onClick={c.closeFunc}
                                                className="ciq-icon ciq-close"
                                            />
                                        </cq-item>
                                    )}
                                </cq-study-legend-content>
                                <cq-placeholder>
                                    <div onClick={this.clearStudies} className="ciq-btn sm">Clear All</div>
                                </cq-placeholder>
                            </cq-section-dynamic>
                        }
                    </cq-study-legend>
                    <cq-scroll cq-studies>
                        <cq-item class="stxTemplate"></cq-item>
                    </cq-scroll>
                </cq-menu-dropdown>
            </cq-menu>
        );
    }
}

export default contextAware(StudyLegend);
