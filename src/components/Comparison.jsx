import $ from 'jquery';
import CIQ from 'chartiq';
import React, { Component } from 'react';
import contextAware from '../contextAware';

class Comparison extends Component {
    constructor() {
        super();
        this.swatchColors = ['#8ec648', '#00afed', '#ee652e', '#912a8e', '#fff126',
            '#e9088c', '#ea1d2c', '#00a553', '#00a99c', '#0056a4', '#f4932f', '#0073ba', '#66308f', '#323390',
        ];
    }

    onContextReady(context) {
        this._context = context;
    }

    /**
     * Picks a color to display the new comparison as.
     * Loops through preset colors and picks the next one on the list.
     * If the all colors are taken then the last color will be repeated.
     * @alias pickSwatchColor
     * @memberof WebComponents.cq-comparison
     */
    getSwatchColor() {
        let stx = this._context.stx;
        let selectedColor = '';

        let usedColors = {};
        for (let s in stx.chart.series) {
            let series = stx.chart.series[s];
            if (!series.parameters.isComparison) continue;
            usedColors[series.parameters.color] = true;
        }

        for (let i = 0; i < this.swatchColors.length; i++) { // find first unused color from available colors
            if (!usedColors[this.swatchColors[i]]) {
                selectedColor = this.swatchColors[i];
                break;
            }
        }

        return selectedColor;
    }

    /**
     * Fires whenever a new security is added as a comparison.
     * Handles all the necessary events to update the chart with the new comparison.
     * @param {object} context `CIQ.UI.Context` The context of the chart.
     * @param {object} obj The object holding info on a security.
     * @alias selectItem
     * @memberof WebComponents.cq-comparison
     */
    selectItem(context, obj) {
        function cb(err, series) {
            if (err) {
                series.parameters.error = true;
            }
        }
        let color = 'auto',
            pattern = null,
            width = 1;
        color = this.getSwatchColor();
        let stx = context.stx;
        let params = {
            symbolObject: obj,
            isComparison: true,
            color,
            pattern,
            width,
            data: {
                useDefaultQuoteFeed: true,
            },
            forceData: true,
        };

        // don't allow symbol if same as main chart, comparison already exists, or just white space
        let exists = stx.getSeries({
            symbolObject: obj,
        });
        for (let i = 0; i < exists.length; i++) {
            if (exists[i].parameters.isComparison) return;
        }

        // don't allow symbol if same as main chart or just white space
        if (context.stx.chart.symbol.toLowerCase() !== obj.symbol.toLowerCase() &&
            obj.symbol.trim().length > 0) {
            stx.addSeries(obj.symbol, params, cb);
        }
    }

    componentDidMount() {
        this.cqLookup.setCallback(function (self) {
            return function () {
                self.selectItem(...arguments);
            };
        }(this));

        let input = this.comparisonInput;
        input.addEventListener('stxtap', function () {
            this.focus();
        });
    }

    render() {
        return (
            <cq-menu class="ciq-menu cq-comparison-new collapse">
                <span className="ciq-icon ciq-ic-comparison" />
                <cq-comparison-add>
                    <cq-comparison-lookup-frame>
                        <cq-lookup
                            ref={(cqLookup) => { this.cqLookup = cqLookup; }}
                            cq-keystroke-claim cq-uppercase
                        >
                            <cq-lookup-input cq-no-close>
                                <input
                                    ref={(input) => { this.comparisonInput = input; }}
                                    type="text"
                                    cq-focus=""
                                    spellCheck="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    placeholder="Enter Symbol"
                                />
                                <cq-lookup-icon />
                            </cq-lookup-input>
                            <cq-lookup-results>
                                <cq-lookup-filters cq-no-close>
                                    <cq-filter class="true">All</cq-filter>
                                    <cq-filter>Forex</cq-filter>
                                    <cq-filter>Indices</cq-filter>
                                    <cq-filter>OTC</cq-filter>
                                    <cq-filter>Commodities</cq-filter>
                                    <cq-filter>Volatility</cq-filter>
                                </cq-lookup-filters>
                                <cq-scroll />
                            </cq-lookup-results>
                        </cq-lookup>
                    </cq-comparison-lookup-frame>
                </cq-comparison-add>
            </cq-menu>
        );
    }
}

export default contextAware(Comparison);
