import { when } from 'mobx';
import MainStore from '.';
import { red as RED } from '../../sass/_themes.scss';
import Context from '../components/ui/Context';
import { is_browser, patchPixelFromChart } from '../utils';

class CurrentSpotStore {
    mainStore: MainStore;
    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        when(() => !!this.context, this.onContextReady);
    }

    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get stx(): Context['stx'] {
        return this.context?.stx;
    }
    get state(): MainStore['state'] {
        return this.mainStore.state;
    }

    onContextReady = () => {
        if (this.mainStore.state.isAnimationEnabled) this.stx.append('draw', this.drawSpot);
        patchPixelFromChart(this.stx);
    };

    drawSpot = () => {
        if (this.state.endEpoch) {
            return;
        }
        const stx: Context['stx'] = this.stx;
        const chart = stx.chart;
        let len = chart.dataSet.length;
        if (!len) {
            return;
        }
        let bar = chart.dataSet[len - 1];
        let prevBar = chart.dataSet[len - 2];

        if (!bar || !prevBar || !bar.Close || !prevBar.Close) {
            const dataSetClose = [...chart.dataSet].filter(item => item && item.Close);
            len = dataSetClose.length;
            if (!len) {
                return;
            }
            bar = dataSetClose[len - 1];
            prevBar = dataSetClose[len - 2];
        }

        if (!bar || !prevBar || !bar.Close || !prevBar.Close) {
            return;
        }
        let x = stx.pixelFromTick(len - 1, chart);
        const deltaX = bar.chartJustAdvanced ? x - stx.pixelFromTick(len - 2, chart) : 0;
        const y = stx.pixelFromPrice(bar.Close, chart.panel);

        const progress = Math.min(bar.tickAnimationProgress || 0, 1);
        if (progress) {
            x -= (1 - progress) * deltaX;
        }

        if (x < 0 || x > chart.yAxis.left || y < chart.yAxis.top || y > chart.yAxis.bottom) {
            return;
        }

        // glow is set by Animation.js
        const glow = is_browser.Firefox() ? 0 : progress;

        /** @type {CanvasRenderingContext2D} */
        const ctx: CanvasRenderingContext2D = stx.chart.context;
        ctx.save();
        if (glow) {
            ctx.shadowBlur = (glow * 35 + 4) | 0;
            let opacity: number | string = Math.sqrt(1.0 - glow) * 255;
            opacity |= 0;
            opacity = opacity.toString(16);
            ctx.shadowColor = RED + opacity;
        }
        ctx.fillStyle = RED;
        for (let i = 0; i < (glow ? 3 : 1); ++i) {
            ctx.beginPath();
            ctx.arc(x - 1, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    };
}

export default CurrentSpotStore;
