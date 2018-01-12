import $ from 'jquery';
import { CIQ } from '../../../js/chartiq';
import Helper from './Helper';

/**
 * UI Helper for Layout changes, for instance tapping items on the display menu. This Helper
 * is also responsible for initializing menu items in the "display" menu based on the chart layout (CIQ.ChartEngine#layout)
 * @name CIQ.UI.Layout
 * @param {CIQ.UI.Context} context The context
 * @param {Object} [params] Parameters
 * @param {string} [params.activeClassName="ciq-active"] The class name to be added to a node when a layout item is enabled
 * @constructor
 * @since  4.1.0 Layout no longer takes a node as its first parameter
 */
class Layout extends Helper {
    constructor(context, params) {
        super(context, params);
        this.params = params || {};
        if (!this.params.activeClassName) this.params.activeClassName = 'ciq-active';
        this.context = context;
        context.advertiseAs(this, 'Layout');
    }
    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} chartType
     */
    getChartType(node, chartType) {
        let activeClassName = this.params.activeClassName;
        // A little complexity here to consolidate two fields (aggregationType and chartType) into one
        // set of radio buttons
        function showChartType(params, node) {
            let layout = params.obj;
            if (layout.aggregationType && layout.aggregationType !== 'ohlc') {
                if (chartType !== layout.aggregationType) {
                    $(node).removeClass(activeClassName);
                } else {
                    $(node).addClass(activeClassName);
                }
            } else if (chartType !== layout.chartType) {
                $(node).removeClass(activeClassName);
            } else {
                $(node).addClass(activeClassName);
            }
        }
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: ['chartType', 'aggregationType'],
            action: 'callback',
            value: showChartType,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} chartType
     */
    setChartType(node, chartType) {
        let aggregations = {
            heikinashi: true,
            kagi: true,
            linebreak: true,
            pandf: true,
            rangebars: true,
            renko: true,
        };
        if (aggregations[chartType]) {
            // this.context.stx.setChartType("candle");
            this.context.stx.setAggregationType(chartType);
        } else {
            this.context.stx.setChartType(chartType);
            // this.context.stx.setAggregationType(null);
        }
    }

    chartType(node) {
        let self = this;

        function showChartType({obj}) {
            const selector = `cq-menu cq-item[stxvalue="${obj.chartType}"]`;
            const cqitem = document.querySelector(selector);
            if(cqitem) {
                node.textContent = cqitem.textContent;
            }
        }
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: ['chartType'],
            action: 'callback',
            value: showChartType,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} chartScale
     */
    getChartScale(node, chartScale) {
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: 'chartScale',
            condition: chartScale,
            action: 'class',
            value: this.params.activeClassName,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} chartType
     */
    setChartScale(node, chartScale) {
        let stx = this.context.stx;
        if (stx.layout.chartScale === chartScale) {
            stx.setChartScale(null);
        } else {
            stx.setChartScale(chartScale);
        }
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     */
    getExtendedHours(node) {
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: 'extended',
            condition: true,
            action: 'class',
            value: this.params.activeClassName,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     */
    setExtendedHours(node) {
        let stx = this.context.stx;
        stx.layout.extended = !stx.layout.extended;
        stx.changeOccurred('layout');

        if (stx.extendedHours) {
            let loader = this.context.loader;
            if (loader) loader.show();
            stx.extendedHours.set(stx.layout.extended, null, () => {
                loader.hide();
            });
        }
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     */
    getRangeSlider(node) {
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: 'rangeSlider',
            condition: true,
            action: 'class',
            value: this.params.activeClassName,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     */
    setRangeSlider(node) {
        let stx = this.context.stx;
        stx.layout.rangeSlider = !stx.layout.rangeSlider;
        if (stx.slider) stx.slider.display(stx.layout.rangeSlider);
        stx.changeOccurred('layout');
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} aggregationType
     */
    getAggregationType(node, aggregationType) {
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: 'aggregationType',
            condition: aggregationType,
            action: 'class',
            value: this.params.activeClassName,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} aggregationType
     */
    setAggregationType(node, aggregationType) {
        if (this.context.stx.layout.aggregationType === aggregationType) {
            this.context.stx.setAggregationType(null);
        } else {
            this.context.stx.setAggregationType(aggregationType);
        }
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} field
     */
    getAggregationEdit(node, field) {
        let stx = this.context.stx;

        function populateEditField(params) {
            let name = params.selector.name;
            let value = params.obj[params.member];
            if (!value && stx.chart.defaultChartStyleConfig[name]) {
                $(params.selector).val(stx.chart.defaultChartStyleConfig[name]);
            } else {
                $(params.selector).val(value);
            }
        }

        let tuple = CIQ.deriveFromObjectChain(stx.layout, field);
        CIQ.UI.observe({
            selector: node,
            obj: tuple.obj,
            member: tuple.member,
            action: 'callback',
            value: populateEditField,
        });
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} field
     */
    setAggregationEdit(node, field) {
        let stx = this.context.stx;
        if (field === 'auto') {
            if (stx.layout.aggregationType === 'kagi') {
                stx.layout.kagi = null;
            } else if (stx.layout.aggregationType === 'renko') {
                stx.layout.renko = null;
            } else if (stx.layout.aggregationType === 'linebreak') {
                stx.layout.priceLines = null;
            } else if (stx.layout.aggregationType === 'rangebars') {
                stx.layout.range = null;
            } else if (stx.layout.aggregationType === 'pandf') {
                if (!stx.layout.pandf) {
                    stx.layout.pandf = { box: null, reversal: null };
                }
                stx.layout.pandf.box = null;
                stx.layout.pandf.reversal = null;
            }
        } else {
            let tuple = CIQ.deriveFromObjectChain(stx.layout, field);
            tuple.obj[tuple.member] = $(node.node).val();
        }
        stx.changeOccurred('layout');
        stx.createDataSet();
        stx.draw();
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {string} aggregationType
     */
    showAggregationEdit(node, aggregationType) {
        let dialog = $('cq-aggregation-dialog');
        dialog[0].open({ context: this.context, aggregationType });
    }

    /**
     * Removes all studies ffrom the top most node
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     */
    clearStudies(node) {
        let stx = this.context.stx;
        for (let id in stx.layout.studies) {
            let sd = stx.layout.studies[id];
            if (!sd.customLegend) CIQ.Studies.removeStudy(stx, sd);
        }
        stx.draw();
    }

    /**
     * @memberof CIQ.UI.Layout
     * @param {HTMLElement} node
     * @param {number} periodicity
     * @param {number} interval
     * @param {number} timeUnit
     */
    setPeriodicity(node, periodicity, interval, timeUnit) {
        const context = this.context;
        const stx = context.stx;

        const wasTick = stx.layout.timeUnit === 'second';

        if (context.loader) {
            context.loader.show();
        }

        stx.setPeriodicity({ period: periodicity, interval, timeUnit }, () => {
            if (context.loader) {
                context.loader.hide();
            }

            const isTickFriendly = ['line', 'mountain', 'baseline_delta'].indexOf(stx.layout.chartType) !== -1;
            const isTick = timeUnit === 'second';

            if (!wasTick && isTick && !isTickFriendly) {
                stx.setChartType('mountain');
            } else if(wasTick && !isTick && isTickFriendly) {
                stx.setChartType('candle');
            }
        });
    }

    periodicity(node) {
        let self = this;

        function showPeriodicity({obj}) {
            const selector = `cq-menu cq-item[stxvalue="${obj.periodicity}-${obj.interval}-${obj.timeUnit || ''}"]`;
            const cqitem = document.querySelector(selector);
            if(cqitem) {
                node.textContent = cqitem.textContent;
            }
        }
        CIQ.UI.observe({
            selector: node,
            obj: this.context.stx.layout,
            member: ['interval', 'periodicity', 'timeUnit'],
            action: 'callback',
            value: showPeriodicity,
        });
    }

    /**
     * Populates and displays the language widget
     * @memberof CIQ.UI.Layout
     */
    setLanguage() {
        let dialog = $('cq-language-dialog').each(function () {
            this.open();
        });
    }


    /**
     * Displays the current language
     * @memberof CIQ.UI.Layout
     */
    getLanguage(node) {
        function showLanguage(params, node) {
            $(node).find('cq-language-name').text(CIQ.I18N.languages[CIQ.I18N.language]);
            $(node).find('cq-flag').attr('cq-lang', CIQ.I18N.language);
        }

        CIQ.UI.observe({
            selector: node,
            obj: CIQ.I18N,
            member: 'language',
            action: 'callback',
            value: showLanguage,
        });
    }
}

export default Layout;
