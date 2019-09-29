import { when } from 'mobx';

class CurrentSpotStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get state() { return this.mainStore.state; }

    onContextReady = () => {
        if (this.mainStore.state.isAnimationEnabled) this.stx.append('draw', this.drawSpot);
        patch_pixel_from_chart(this.stx); // eslint-disable-line
    }

    drawSpot = () => {
        if (this.state.endEpoch) { return; }
        const stx = this.stx;
        const chart = stx.chart;
        const len = chart.dataSet.length;
        if (!len) { return; }
        const bar = chart.dataSet[len - 1];
        const prev_bar = chart.dataSet[len - 2];
        if (!bar || !prev_bar || !bar.Close || !prev_bar.Close) { return; }
        let x = stx.pixelFromTick(len - 1, chart);
        const delta_x = bar.chartJustAdvanced ? x - stx.pixelFromTick(len - 2, chart) : 0;
        const y = stx.pixelFromPrice(bar.Close, chart.panel);

        const  progress = Math.min(bar.tickAnimationProgress || 0, 1);
        if (progress) {
            x -=  (1 - progress) * delta_x;
        }

        if (
            x < 0
            || x > chart.yAxis.left
            || y < chart.yAxis.top
            || y > chart.yAxis.bottom
        ) {
            return;
        }

        // glow is set by Animation.js
        const glow = progress;

        /** @type {CanvasRenderingContext2D} */
        const ctx = stx.chart.context;
        ctx.save();
        if (glow) {
            ctx.shadowBlur = (glow * 35 + 4) | 0;
            let opacity = Math.sqrt(1.0 - glow) * 255;
            opacity |= 0;
            opacity = opacity.toString(16);
            ctx.shadowColor = `#ff444f${opacity}`;
        }
        ctx.fillStyle = '#ff444f';
        for (let i = 0; i < (glow ? 3 : 1); ++i) {
            ctx.beginPath();
            ctx.arc(x - 1, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    }
}

export default CurrentSpotStore;


// Get a raw callback with underlying canvas2dcontext
// This component is used to render directly into the chart canvas.
//
// Props:
//
//  - epoch_array: array of epoch values to get coordinates for.
//  - price_array: array of price values to get y-coordinates for.
//  - draw_callback: called on every frame with ({ctx, points, prices}).
//  -- points will be an array of [{left, top, epoch}] in pixels.
//  -- ctx is the Context2dDrawingContext


// Unfortunately chartiq.js does a Math.floor() on pixel values,
// Which causes a jerky effect on the markers in auto-scroll,
// However we need the pixel value down to the decimal points.
// This is copy from chartiq.js file WITHOUT rounding down the pixel value.

function patch_pixel_from_chart(stx) {
    stx.pixelFromTick = function (tick, _chart) {
        const chart = _chart || stx.chart;
        const dataSegment = chart.dataSegment,
            dataSet = chart.dataSet,
            segmentImage = chart.segmentImage,
            mp = stx.micropixels,
            length = dataSegment ? dataSegment.length : 0;
        const panel = chart.panel,
            scroll = chart.scroll;
        const bar = tick - dataSet.length + scroll;
        let quote = length ? dataSegment[bar] : null;

        if (segmentImage) quote = segmentImage[bar];
        if (quote && quote.leftOffset) {
            // return Math.floor(panel.left + quote.leftOffset + mp)
            return panel.left + quote.leftOffset + mp;
        }
        let rightOffset = 0, dsTicks = 0;
        quote = length ? dataSegment[length - 1] : null;
        if (segmentImage) quote = segmentImage[length - 1];
        if (quote && quote.leftOffset) {
            if (length < tick - dataSet.length + scroll) {
                rightOffset = quote.leftOffset - quote.candleWidth / 2;
                dsTicks = length;
            }
        }
        // return Math.floor(/* ... */)
        return rightOffset + panel.left
            + (tick - dsTicks - dataSet.length + scroll + 0.5)
            * stx.layout.candleWidth + mp;
    };
}
