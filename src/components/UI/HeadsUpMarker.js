import { CIQ } from '../../../js/chartiq';

function getBottomPixel(stx, panel, containerHeight, price) {
    return Math.round(containerHeight - stx.pixelFromPrice(price, panel));
}

/**
 * A Heads up marker for displaying OHLC values on the chart.
 *
 * @name CIQ.Marker.HeadsUp
 * @constructor
 * @param {object} params
 * @param showClass
 */
class HeadsUpMarker extends CIQ.Marker {
    constructor(params, showClass) {
        if (!this.className) this.className = 'CIQ.Marker.HeadsUp';
        CIQ.Marker.call(this, params);
        this.prevTick = null;
        this.showClass = showClass;
    }

    /**
     * Determines the location of the HeadsUp Marker.
     *
     * @memberof CIQ.Marker.HeadsUp
     * @param {object} params
     */
    placementFunction(params) {
        let panel = params.panel;
        let chart = panel.chart;
        let stx = params.stx;
        let useHighs = stx.highLowBars[stx.layout.chartType];
        if (!params.showClass) params.showClass = 'stx-show';

        for (let i = 0; i < params.arr.length; ++i) {
            let marker = params.arr[i];
            let node = $(marker.node);
            if (panel.hidden || !CIQ.ChartEngine.insideChart) {
                node.removeClass(params.showClass);
                return;
            }
            if (marker.params.x < 0 || marker.params.x >= chart.dataSet.length) {
                node.removeClass(params.showClass);
                return;
            }
            // always show the hud even if the crosshair toggle or a drawing tool is selected
            if (stx.layout.crosshair || stx.currentVectorParameters.vectorType) {
                node.removeClass(params.showClass);
                return;
            }
            let quote = chart.dataSet[marker.params.x];
            let x = stx.pixelFromTick(marker.params.x);
            if (!quote || x < chart.left || x > chart.right) {
                node.removeClass(params.showClass);
                return;
            }
            node.addClass(params.showClass);

            if (!marker.clientWidth) {
                marker.clientWidth = node.width();
            }
            if (!marker.clientHeight) {
                marker.clientHeight = node.height();
            }
            if (marker.clientWidth > x) {
                node.removeClass('stx-left');
                node.addClass('stx-right');
                node.css({
                    left: `${x}px`,
                    right: 'auto',
                });
            } else {
                node.addClass('stx-left');
                node.removeClass('stx-right');
                node.css({
                    right: `${stx.chart.canvasWidth - x}px`,
                    left: 'auto',
                });
            }

            let bottom;
            let containerHeight = marker.params.chartContainer ? stx.chart.canvasHeight : panel.bottom;
            if (useHighs) {
                bottom = getBottomPixel(stx, panel, containerHeight, stx.getBarBounds(quote).high);
            } else {
                bottom = getBottomPixel(stx, panel, containerHeight, quote[stx.chart.defaultPlotField]);
            }
            // Keep below top of screen
            let top = containerHeight - bottom - marker.clientHeight + stx.top;
            if (top < 0) {
                node.addClass('stx-below');
                bottom = (useHighs ? getBottomPixel(stx, panel, containerHeight, stx.getBarBounds(quote).low) : bottom) - marker.clientHeight;
            } else {
                node.removeClass('stx-below');
            }

            let bottomPX = `${bottom}px`;

            if (marker.node.style.bottom != bottomPX) {
                marker.node.style.bottom = bottomPX;
            }
        }
    }
}

export default HeadsUpMarker;
